
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
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="rldatix-gradient text-white">
          <div className="flex items-center justify-between">
            {editingTitle ? (
              <Input
                value={form.title}
                onChange={(e) => updateTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="bg-white text-[hsl(var(--rldatix-navy))] text-xl font-bold border-0 shadow-lg"
                autoFocus
              />
            ) : (
              <CardTitle 
                className="text-xl cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors"
                onClick={() => setEditingTitle(true)}
              >
                {form.title}
              </CardTitle>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {form.sections.map((section, index) => (
          <Card key={section.id} className="shadow-lg border-0 border-l-4 border-l-[hsl(var(--rldatix-blue))] overflow-hidden">
            <CardHeader className="bg-[hsl(var(--rldatix-light-blue))]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <GripVertical className="h-5 w-5 text-[hsl(var(--rldatix-navy))] opacity-60" />
                  <TrafficLight status={section.status} />
                  <CardTitle className="text-lg text-[hsl(var(--rldatix-navy))]">{section.title}</CardTitle>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="bg-[hsl(var(--rldatix-red))] hover:bg-[hsl(var(--rldatix-red))] shadow-md"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
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
        className="w-full h-14 rldatix-button-success border-2 border-dashed border-[hsl(var(--rldatix-green))] bg-green-50 hover:bg-green-100 text-[hsl(var(--rldatix-green))] hover:text-white shadow-lg transition-all"
        variant="outline"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Section
      </Button>
    </div>
  );
};
