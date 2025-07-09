
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, Eye, Settings } from 'lucide-react';
import { FormBuilder } from '@/components/appraisal/FormBuilder';
import { FormPreview } from '@/components/appraisal/FormPreview';
import { WorkflowAssignment } from '@/components/appraisal/WorkflowAssignment';
import { AppraisalForm, FormSection } from '@/types/appraisal';

const AppraisalBuilder = () => {
  const [forms, setForms] = useState<AppraisalForm[]>([]);
  const [currentForm, setCurrentForm] = useState<AppraisalForm | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'workflow'>('builder');

  const createNewForm = () => {
    const newForm: AppraisalForm = {
      id: Date.now().toString(),
      title: 'New Appraisal Form',
      sections: [],
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setForms([...forms, newForm]);
    setCurrentForm(newForm);
    setActiveTab('builder');
  };

  const updateForm = (updatedForm: AppraisalForm) => {
    setForms(forms.map(form => form.id === updatedForm.id ? updatedForm : form));
    setCurrentForm(updatedForm);
  };

  return (
    <div className="min-h-screen rldatix-card-gradient">
      {/* RLDATIX Official Header */}
      <header className="rldatix-gradient text-white shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* RLDATIX Official Logo */}
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-xl">
                <div className="text-[hsl(var(--rldatix-navy))] font-bold text-2xl tracking-tight">
                  RL
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">RLDATIX</h1>
                <p className="text-blue-100 text-lg font-medium">Appraisal Form Builder</p>
              </div>
            </div>
            <Button onClick={createNewForm} className="rldatix-button-primary shadow-xl px-6 py-3 text-lg">
              <Plus className="w-5 h-5 mr-3" />
              New Form
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - Form List */}
          <div className="col-span-3">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="rldatix-gradient text-white">
                <CardTitle className="text-xl font-bold">Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="space-y-3">
                  {forms.map(form => (
                    <Button
                      key={form.id}
                      variant={currentForm?.id === form.id ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-auto py-4 px-4 ${
                        currentForm?.id === form.id 
                          ? 'rldatix-button-primary shadow-lg' 
                          : 'hover:bg-[hsl(var(--rldatix-light-blue))] hover:text-[hsl(var(--rldatix-navy))] border border-gray-200'
                      }`}
                      onClick={() => setCurrentForm(form)}
                    >
                      <div>
                        <div className="font-semibold truncate text-base">{form.title}</div>
                        <div className="text-sm opacity-80 mt-1">
                          {form.sections.length} sections
                        </div>
                      </div>
                    </Button>
                  ))}
                  {forms.length === 0 && (
                    <p className="text-muted-foreground text-center py-12 text-lg">
                      No forms created yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {currentForm ? (
              <>
                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-8">
                  <Button
                    variant={activeTab === 'builder' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('builder')}
                    className={`rounded-r-none px-6 py-3 text-lg ${
                      activeTab === 'builder' 
                        ? 'rldatix-button-primary shadow-lg' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Builder
                  </Button>
                  <Button
                    variant={activeTab === 'preview' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('preview')}
                    className={`rounded-none px-6 py-3 text-lg ${
                      activeTab === 'preview' 
                        ? 'rldatix-button-primary shadow-lg' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    Preview
                  </Button>
                  <Button
                    variant={activeTab === 'workflow' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('workflow')}
                    className={`rounded-l-none px-6 py-3 text-lg ${
                      activeTab === 'workflow' 
                        ? 'rldatix-button-primary shadow-lg' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Save className="w-5 h-5 mr-3" />
                    Workflow
                  </Button>
                </div>

                {/* Tab Content */}
                {activeTab === 'builder' && (
                  <FormBuilder form={currentForm} onUpdate={updateForm} />
                )}
                {activeTab === 'preview' && (
                  <FormPreview form={currentForm} />
                )}
                {activeTab === 'workflow' && (
                  <WorkflowAssignment form={currentForm} onUpdate={updateForm} />
                )}
              </>
            ) : (
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-16 text-center bg-white">
                  <div className="w-24 h-24 bg-[hsl(var(--rldatix-light-blue))] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Plus className="w-12 h-12 text-[hsl(var(--rldatix-navy))]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-[hsl(var(--rldatix-navy))]">Create Your First Form</h3>
                  <p className="text-muted-foreground mb-10 text-xl max-w-md mx-auto">
                    Start building appraisal forms with our powerful template builder
                  </p>
                  <Button onClick={createNewForm} size="lg" className="rldatix-button-primary shadow-xl px-10 py-4 text-lg">
                    <Plus className="w-6 h-6 mr-3" />
                    Create New Form
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalBuilder;
