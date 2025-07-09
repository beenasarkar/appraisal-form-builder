
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* RLDATIX Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">RL</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">RLDATIX</h1>
                <p className="text-blue-200 text-sm">Appraisal Form Builder</p>
              </div>
            </div>
            <Button onClick={createNewForm} className="bg-green-600 hover:bg-green-700">
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
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-lg">Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {forms.map(form => (
                    <Button
                      key={form.id}
                      variant={currentForm?.id === form.id ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setCurrentForm(form)}
                    >
                      <div>
                        <div className="font-medium truncate">{form.title}</div>
                        <div className="text-xs text-muted-foreground">
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
                    className="rounded-r-none"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Builder
                  </Button>
                  <Button
                    variant={activeTab === 'preview' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('preview')}
                    className="rounded-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={activeTab === 'workflow' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('workflow')}
                    className="rounded-l-none"
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
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Your First Form</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building appraisal forms with our powerful template builder
                  </p>
                  <Button onClick={createNewForm} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
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
