
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { AppraisalForm, FormSection } from '@/types/appraisal';
import { SectionBuilder } from './SectionBuilder';
import { TrafficLight } from './TrafficLight';

interface FormBuilderProps {
  form: AppraisalForm;
  onUpdate: (form: AppraisalForm) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ form, onUpdate }) => {
  const [editingTitle, setEditingTitle] = useState(false);

  const updateTitle = (title: string) => {
    onUpdate({ ...form, title });
    setEditingTitle(false);
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      title: 'New Section',
      status: 'not-started',
      fields: []
    };
    onUpdate({
      ...form,
      sections: [...form.sections, newSection]
    });
  };

  const updateSection = (sectionId: string, updatedSection: FormSection) => {
    onUpdate({
      ...form,
      sections: form.sections.map(section =>
        section.id === sectionId ? updatedSection : section
      )
    });
  };

  const deleteSection = (sectionId: string) => {
    onUpdate({
      ...form,
      sections: form.sections.filter(section => section.id !== sectionId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Title */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            {editingTitle ? (
              <Input
                value={form.title}
                onChange={(e) => updateTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="bg-white text-black text-xl font-bold"
                autoFocus
              />
            ) : (
              <CardTitle 
                className="text-xl cursor-pointer hover:bg-white/10 p-2 rounded"
                onClick={() => setEditingTitle(true)}
              >
                {form.title}
              </CardTitle>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {form.sections.map((section, index) => (
          <Card key={section.id} className="shadow-md border-l-4 border-l-blue-500">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <TrafficLight status={section.status} />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <SectionBuilder
                section={section}
                onUpdate={(updatedSection) => updateSection(section.id, updatedSection)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Section Button */}
      <Button 
        onClick={addSection} 
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100"
        variant="outline"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Section
      </Button>
    </div>
  );
};
