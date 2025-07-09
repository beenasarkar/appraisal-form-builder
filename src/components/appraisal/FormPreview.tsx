
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mic, Sparkles, Upload } from 'lucide-react';
import { AppraisalForm, FormField } from '@/types/appraisal';
import { TrafficLight } from './TrafficLight';

interface FormPreviewProps {
  form: AppraisalForm;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: FormField) => {
    const fieldValue = formData[field.id];

    switch (field.type) {
      case 'label':
        return (
          <div className="py-2">
            <Label className="text-lg font-semibold">{field.label}</Label>
          </div>
        );

      case 'textbox':
        return (
          <div className="space-y-2">
            <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div className="relative">
              {field.settings?.expandable ? (
                <Textarea
                  value={fieldValue || ''}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-20 resize-y"
                />
              ) : (
                <Input
                  value={fieldValue || ''}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              {field.settings && (
                <div className="flex space-x-2 mt-2">
                  {field.settings.dictate && (
                    <Button variant="outline" size="sm">
                      <Mic className="h-3 w-3 mr-1" />
                      Dictate
                    </Button>
                  )}
                  {field.settings.summarize && (
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Summarize
                    </Button>
                  )}
                </div>
              )}
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
    <div className="space-y-6">
      {/* Form Header */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          <p className="text-blue-100">Form Preview</p>
        </CardHeader>
      </Card>

      {/* Form Sections */}
      {form.sections.map((section) => (
        <Card key={section.id} className="shadow-md border-l-4 border-l-blue-500">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <TrafficLight status={section.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {section.fields.map((field) => (
              <div key={field.id}>
                {renderField(field)}
              </div>
            ))}
            {section.fields.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No fields in this section
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {form.sections.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No sections added to this form yet
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          Submit Appraisal
        </Button>
      </div>
    </div>
  );
};
