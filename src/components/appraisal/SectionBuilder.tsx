
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Mic, Sparkles, Star, BarChart3, Heart } from 'lucide-react';
import { FormSection, FormField } from '@/types/appraisal';
import { TrafficLight } from './TrafficLight';

interface SectionBuilderProps {
  section: FormSection;
  onUpdate: (section: FormSection) => void;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({ section, onUpdate }) => {
  const [editingTitle, setEditingTitle] = useState(false);

  const updateTitle = (title: string) => {
    onUpdate({ ...section, title });
    setEditingTitle(false);
  };

  const updateStatus = (status: 'not-started' | 'in-progress' | 'complete') => {
    onUpdate({ ...section, status });
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      required: false,
      ...(type === 'textbox' && {
        settings: {
          expandable: true,
          dictate: false,
          summarize: false,
          sentiment: false
        }
      }),
      ...(type === 'score' && {
        settings: {
          minScore: 1,
          maxScore: 10
        }
      }),
      ...((['radio', 'dropdown', 'multiselect'].includes(type)) && {
        options: ['Option 1', 'Option 2', 'Option 3']
      })
    };
    onUpdate({
      ...section,
      fields: [...section.fields, newField]
    });
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    onUpdate({
      ...section,
      fields: section.fields.map(field =>
        field.id === fieldId ? updatedField : field
      )
    });
  };

  const deleteField = (fieldId: string) => {
    onUpdate({
      ...section,
      fields: section.fields.filter(field => field.id !== fieldId)
    });
  };

  const fieldTypes = [
    { value: 'label', label: 'Label', icon: Plus },
    { value: 'textbox', label: 'Text Box', icon: Plus },
    { value: 'radio', label: 'Radio Buttons', icon: Plus },
    { value: 'attachment', label: 'Attachment', icon: Plus },
    { value: 'dropdown', label: 'Dropdown', icon: Plus },
    { value: 'multiselect', label: 'Multi-select', icon: Plus },
    { value: 'score', label: 'Score (1-10)', icon: Star },
    { value: 'sentiment', label: 'Sentiment', icon: Heart }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {editingTitle ? (
            <Input
              value={section.title}
              onChange={(e) => updateTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              className="text-lg font-semibold"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => setEditingTitle(true)}
            >
              {section.title}
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Label>Status:</Label>
          <TrafficLight 
            status={section.status} 
            interactive 
            onChange={updateStatus}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {section.fields.map((field) => (
          <FieldEditor
            key={field.id}
            field={field}
            onUpdate={(updatedField) => updateField(field.id, updatedField)}
            onDelete={() => deleteField(field.id)}
          />
        ))}
      </div>

      {/* Add Field Buttons */}
      <div className="border-t pt-4">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Add Field:</Label>
        <div className="grid grid-cols-4 gap-2">
          {fieldTypes.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              size="sm"
              onClick={() => addField(type.value as FormField['type'])}
              className="h-12 flex flex-col items-center justify-center text-xs hover:bg-[hsl(var(--rldatix-light-blue))] hover:text-[hsl(var(--rldatix-navy))]"
            >
              <type.icon className="h-4 w-4 mb-1" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onDelete }) => {
  const updateLabel = (label: string) => {
    onUpdate({ ...field, label });
  };

  const updateOptions = (options: string[]) => {
    onUpdate({ ...field, options });
  };

  const toggleRequired = (required: boolean) => {
    onUpdate({ ...field, required });
  };

  const updateSettings = (settings: any) => {
    onUpdate({ ...field, settings: { ...field.settings, ...settings } });
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <div>
            <Label>Field Label</Label>
            <Input
              value={field.label}
              onChange={(e) => updateLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.required || false}
              onCheckedChange={toggleRequired}
            />
            <Label>Required field</Label>
          </div>
        </div>
        
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Field-specific settings */}
      {field.type === 'textbox' && (
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Text Box Options:</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.settings?.expandable || false}
                onCheckedChange={(checked) => updateSettings({ expandable: checked })}
              />
              <Label className="text-sm">Expandable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.settings?.dictate || false}
                onCheckedChange={(checked) => updateSettings({ dictate: checked })}
              />
              <Label className="text-sm flex items-center">
                <Mic className="h-3 w-3 mr-1" />
                Dictate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.settings?.summarize || false}
                onCheckedChange={(checked) => updateSettings({ summarize: checked })}
              />
              <Label className="text-sm flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Summarize
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.settings?.sentiment || false}
                onCheckedChange={(checked) => updateSettings({ sentiment: checked })}
              />
              <Label className="text-sm flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                Sentiment Analysis
              </Label>
            </div>
          </div>
        </div>
      )}

      {field.type === 'score' && (
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Score Range:</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Min:</Label>
              <Input
                type="number"
                value={field.settings?.minScore || 1}
                onChange={(e) => updateSettings({ minScore: parseInt(e.target.value) || 1 })}
                className="w-20"
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Max:</Label>
              <Input
                type="number"
                value={field.settings?.maxScore || 10}
                onChange={(e) => updateSettings({ maxScore: parseInt(e.target.value) || 10 })}
                className="w-20"
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>
      )}

      {(['radio', 'dropdown', 'multiselect'].includes(field.type)) && (
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Options:</Label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[index] = e.target.value;
                    updateOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = field.options?.filter((_, i) => i !== index) || [];
                    updateOptions(newOptions);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                updateOptions(newOptions);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
