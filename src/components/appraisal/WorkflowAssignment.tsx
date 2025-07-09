
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, Calendar, FileText } from 'lucide-react';
import { AppraisalForm, WorkflowProcess } from '@/types/appraisal';

interface WorkflowAssignmentProps {
  form: AppraisalForm;
  onUpdate: (form: AppraisalForm) => void;
}

export const WorkflowAssignment: React.FC<WorkflowAssignmentProps> = ({ form, onUpdate }) => {
  const [workflow, setWorkflow] = useState<WorkflowProcess>({
    preAppraisal: false,
    appraisalMeeting: false,
    postAppraisal: false,
    assignedForm: form.id
  });

  const updateWorkflow = (updates: Partial<WorkflowProcess>) => {
    const updatedWorkflow = { ...workflow, ...updates };
    setWorkflow(updatedWorkflow);
    
    // Update form with workflow information
    onUpdate({
      ...form,
      workflow: updatedWorkflow.preAppraisal ? 'pre-appraisal' :
                updatedWorkflow.appraisalMeeting ? 'appraisal-meeting' :
                updatedWorkflow.postAppraisal ? 'post-appraisal' : undefined
    });
  };

  const workflowStages = [
    {
      id: 'preAppraisal',
      title: 'Pre-Appraisal Meeting',
      description: 'Preparation phase before the main appraisal meeting',
      icon: FileText,
      color: 'bg-blue-500',
      tasks: [
        'Self-assessment completion',
        'Goal setting preparation',
        'Documentation review',
        'Scheduling coordination'
      ]
    },
    {
      id: 'appraisalMeeting',
      title: 'Appraisal Meeting',
      description: 'Main discussion and evaluation session',
      icon: Users,
      color: 'bg-green-500',
      tasks: [
        'Performance review discussion',
        'Goal achievement evaluation',
        'Development needs assessment',
        'Future planning'
      ]
    },
    {
      id: 'postAppraisal',
      title: 'Post-Appraisal Meeting',
      description: 'Follow-up actions and documentation',
      icon: CheckCircle,
      color: 'bg-purple-500',
      tasks: [
        'Action plan finalization',
        'Development goals setting',
        'Training needs identification',
        'Next review scheduling'
      ]
    }
  ];

  const assignToWorkflow = () => {
    // Logic to assign form to selected workflow stages
    console.log('Form assigned to workflow:', workflow);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Workflow Assignment
          </CardTitle>
          <p className="text-purple-100">
            Assign "{form.title}" to workflow stages
          </p>
        </CardHeader>
      </Card>

      {/* Workflow Stages */}
      <div className="grid gap-6">
        {workflowStages.map((stage) => {
          const StageIcon = stage.icon;
          const isSelected = workflow[stage.id as keyof WorkflowProcess] as boolean;
          
          return (
            <Card
              key={stage.id}
              className={`transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${stage.color} text-white`}>
                      <StageIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            updateWorkflow({ [stage.id]: checked })
                          }
                        />
                        <CardTitle className="text-lg">{stage.title}</CardTitle>
                        {isSelected && (
                          <Badge className="bg-green-100 text-green-800">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {isSelected && (
                <CardContent className="pt-0">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Key Activities
                    </h4>
                    <ul className="space-y-2">
                      {stage.tasks.map((task, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Assignment Summary */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Assignment Summary</h3>
          <div className="space-y-2">
            <p><strong>Form:</strong> {form.title}</p>
            <p><strong>Sections:</strong> {form.sections.length}</p>
            <p><strong>Selected Stages:</strong> {
              Object.entries(workflow)
                .filter(([key, value]) => key !== 'assignedForm' && value)
                .map(([key]) => workflowStages.find(s => s.id === key)?.title)
                .join(', ') || 'None selected'
            }</p>
            <p><strong>Status:</strong> 
              <Badge variant="outline" className="ml-2">
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </Badge>
            </p>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={assignToWorkflow}
              disabled={!Object.entries(workflow).some(([key, value]) => key !== 'assignedForm' && value)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Assign to Workflow
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
