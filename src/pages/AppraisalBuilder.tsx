
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
      {/* RLDATIX Header */}
      <header className="rldatix-gradient text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[hsl(var(--rldatix-navy))] font-bold text-xl">RL</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">RLDATIX</h1>
                <p className="text-blue-100 text-sm font-medium">Appraisal Form Builder</p>
              </div>
            </div>
            <Button onClick={createNewForm} className="rldatix-button-success shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Form List */}
          <div className="col-span-3">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="rldatix-gradient text-white">
                <CardTitle className="text-lg font-semibold">Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white">
                <div className="space-y-2">
                  {forms.map(form => (
                    <Button
                      key={form.id}
                      variant={currentForm?.id === form.id ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-auto py-3 ${
                        currentForm?.id === form.id 
                          ? 'rldatix-button-primary' 
                          : 'hover:bg-[hsl(var(--rldatix-light-blue))] hover:text-[hsl(var(--rldatix-navy))]'
                      }`}
                      onClick={() => setCurrentForm(form)}
                    >
                      <div>
                        <div className="font-medium truncate">{form.title}</div>
                        <div className="text-xs opacity-70">
                          {form.sections.length} sections
                        </div>
                      </div>
                    </Button>
                  ))}
                  {forms.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
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
                <div className="flex space-x-1 mb-6">
                  <Button
                    variant={activeTab === 'builder' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('builder')}
                    className={`rounded-r-none ${
                      activeTab === 'builder' 
                        ? 'rldatix-button-primary' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Builder
                  </Button>
                  <Button
                    variant={activeTab === 'preview' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('preview')}
                    className={`rounded-none ${
                      activeTab === 'preview' 
                        ? 'rldatix-button-primary' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={activeTab === 'workflow' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('workflow')}
                    className={`rounded-l-none ${
                      activeTab === 'workflow' 
                        ? 'rldatix-button-primary' 
                        : 'border-[hsl(var(--rldatix-blue))] text-[hsl(var(--rldatix-navy))] hover:bg-[hsl(var(--rldatix-light-blue))]'
                    }`}
                  >
                    <Save className="w-4 h-4 mr-2" />
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
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardContent className="p-12 text-center bg-white">
                  <div className="w-20 h-20 bg-[hsl(var(--rldatix-light-blue))] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Plus className="w-10 h-10 text-[hsl(var(--rldatix-navy))]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[hsl(var(--rldatix-navy))]">Create Your First Form</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Start building appraisal forms with our powerful template builder
                  </p>
                  <Button onClick={createNewForm} size="lg" className="rldatix-button-primary shadow-lg px-8 py-3">
                    <Plus className="w-5 h-5 mr-2" />
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
