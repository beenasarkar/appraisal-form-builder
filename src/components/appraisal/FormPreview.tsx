
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mic, Sparkles, Upload, Heart, Meh, Frown } from 'lucide-react';
import { AppraisalForm, FormField, SentimentAnalysis } from '@/types/appraisal';
import { TrafficLight } from './TrafficLight';
import { SentimentIndicator } from './SentimentIndicator';
import { ScoreInput } from './ScoreInput';

interface FormPreviewProps {
  form: AppraisalForm;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sentimentData, setSentimentData] = useState<Record<string, SentimentAnalysis>>({});

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const analyzeSentiment = async (text: string, fieldId: string) => {
    // Mock sentiment analysis - in real implementation, this would call an AI service
    const mockSentiment: SentimentAnalysis = {
      score: Math.random(),
      label: text.length > 50 ? 'positive' : text.length > 20 ? 'neutral' : 'negative',
      confidence: 0.8 + Math.random() * 0.2
    };
    setSentimentData(prev => ({ ...prev, [fieldId]: mockSentiment }));
  };

  const renderField = (field: FormField) => {
    const fieldValue = formData[field.id];

    switch (field.type) {
      case 'label':
        return (
          <div className="py-3">
            <Label className="text-xl font-bold text-[hsl(var(--rldatix-navy))]">{field.label}</Label>
          </div>
        );

      case 'textbox':
        return (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div className="relative">
              {field.settings?.expandable ? (
                <Textarea
                  value={fieldValue || ''}
                  onChange={(e) => {
                    updateFieldValue(field.id, e.target.value);
                    if (field.settings?.sentiment && e.target.value.length > 10) {
                      analyzeSentiment(e.target.value, field.id);
                    }
                  }}
                  placeholder={field.placeholder}
                  className="min-h-24 resize-y border-2 border-[hsl(var(--rldatix-blue))] focus:border-[hsl(var(--rldatix-navy))]"
                />
              ) : (
                <Input
                  value={fieldValue || ''}
                  onChange={(e) => {
                    updateFieldValue(field.id, e.target.value);
                    if (field.settings?.sentiment && e.target.value.length > 10) {
                      analyzeSentiment(e.target.value, field.id);
                    }
                  }}
                  placeholder={field.placeholder}
                  className="border-2 border-[hsl(var(--rldatix-blue))] focus:border-[hsl(var(--rldatix-navy))]"
                />
              )}
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  {field.settings?.dictate && (
                    <Button variant="outline" size="sm" className="rldatix-button-primary">
                      <Mic className="h-4 w-4 mr-2" />
                      Dictate
                    </Button>
                  )}
                  {field.settings?.summarize && (
                    <Button variant="outline" size="sm" className="rldatix-button-primary">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Summarize
                    </Button>
                  )}
                  {field.settings?.sentiment && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fieldValue && analyzeSentiment(fieldValue, field.id)}
                      className="rldatix-button-primary"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Analyze Sentiment
                    </Button>
                  )}
                </div>
                {field.settings?.sentiment && sentimentData[field.id] && (
                  <SentimentIndicator sentiment={sentimentData[field.id]} />
                )}
              </div>
            </div>
          </div>
        );

      case 'score':
        return (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <ScoreInput
              value={fieldValue}
              onChange={(score) => updateFieldValue(field.id, score)}
              min={field.settings?.minScore || 1}
              max={field.settings?.maxScore || 10}
            />
          </div>
        );

      case 'sentiment':
        return (
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div className="flex space-x-3">
              {['positive', 'neutral', 'negative'].map((sentiment) => (
                <Button
                  key={sentiment}
                  variant={fieldValue === sentiment ? "default" : "outline"}
                  onClick={() => updateFieldValue(field.id, sentiment)}
                  className={`px-6 py-3 ${
                    fieldValue === sentiment 
                      ? `rldatix-sentiment-${sentiment}` 
                      : 'hover:bg-[hsl(var(--rldatix-light-blue))]'
                  }`}
                >
                  {sentiment === 'positive' && <Heart className="h-4 w-4 mr-2" />}
                  {sentiment === 'neutral' && <Meh className="h-4 w-4 mr-2" />}
                  {sentiment === 'negative' && <Frown className="h-4 w-4 mr-2" />}
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <RadioGroup
              value={fieldValue}
              onValueChange={(value) => updateFieldValue(field.id, value)}
            >
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-2">
            <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <Select value={fieldValue} onValueChange={(value) => updateFieldValue(field.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-3">
            <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={(fieldValue || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = fieldValue || [];
                      if (checked) {
                        updateFieldValue(field.id, [...currentValues, option]);
                      } else {
                        updateFieldValue(field.id, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                  />
                  <Label>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'attachment':
        return (
          <div className="space-y-2">
            <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG up to 10MB</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <Card className="shadow-xl border-0">
        <CardHeader className="rldatix-gradient text-white">
          <CardTitle className="text-3xl font-bold">{form.title}</CardTitle>
          <p className="text-blue-100 text-lg">Form Preview</p>
        </CardHeader>
      </Card>

      {/* Form Sections */}
      {form.sections.map((section) => (
        <Card key={section.id} className="shadow-lg border-l-4 border-l-[hsl(var(--rldatix-blue))]">
          <CardHeader className="bg-[hsl(var(--rldatix-light-blue))]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-[hsl(var(--rldatix-navy))]">{section.title}</CardTitle>
              <TrafficLight status={section.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8 bg-white">
            {section.fields.map((field) => (
              <div key={field.id}>
                {renderField(field)}
              </div>
            ))}
            {section.fields.length === 0 && (
              <p className="text-muted-foreground text-center py-8 text-lg">
                No fields in this section
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {form.sections.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-16 text-center">
            <p className="text-muted-foreground text-xl">
              No sections added to this form yet
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-6 pt-8">
        <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
          Save Draft
        </Button>
        <Button size="lg" className="rldatix-button-primary px-8 py-4 text-lg shadow-xl">
          Submit Appraisal
        </Button>
      </div>
    </div>
  );
};
