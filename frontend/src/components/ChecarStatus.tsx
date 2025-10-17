import { Check, X, Circle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: string;
}

type StatusStep = {
  id: string;
  label: string;
  description: string;
};

const statusSteps: StatusStep[] = [
  { id: 'submitted', label: 'Enviado', description: 'Roteiro recebido' },
  { id: 'in-analysis', label: 'Em Análise', description: 'Análise inicial' },
  { id: 'in-review', label: 'Em Revisão', description: 'Revisão detalhada' },
  { id: 'in-approval', label: 'Em Aprovação', description: 'Votação final' },
  { id: 'completed', label: 'Finalizado', description: 'Processo concluído' }
];

export function ChecarStatus({ currentStatus }: StatusTimelineProps) {
  const getCurrentStepIndex = () => {
    if (currentStatus === 'approved' || currentStatus === 'rejected') {
      return 4; // completed
    }
    
    const statusMap: Record<string, number> = {
      'submitted': 0,
      'pending-analysis': 0,
      'in-analysis': 1,
      'analysis-approved': 1,
      'pending-review': 1,
      'in-review': 2,
      'review-approved': 2,
      'pending-approval': 2,
      'in-approval': 3
    };
    
    return statusMap[currentStatus] ?? 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isApproved = currentStatus === 'approved';
  const isRejected = currentStatus === 'rejected';

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === statusSteps.length - 1;
          
          let stepStatus: 'completed' | 'current' | 'pending' | 'approved' | 'rejected' = 'pending';
          
          if (isLast && isApproved) {
            stepStatus = 'approved';
          } else if (isLast && isRejected) {
            stepStatus = 'rejected';
          } else if (isCompleted) {
            stepStatus = 'completed';
          } else if (isCurrent) {
            stepStatus = 'current';
          }

          return (
            <div key={step.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                  ${stepStatus === 'completed' ? 'bg-blue-600' : ''}
                  ${stepStatus === 'current' ? 'bg-blue-600 ring-4 ring-blue-100' : ''}
                  ${stepStatus === 'pending' ? 'bg-gray-200' : ''}
                  ${stepStatus === 'approved' ? 'bg-green-600' : ''}
                  ${stepStatus === 'rejected' ? 'bg-red-600' : ''}
                `}>
                  {stepStatus === 'completed' && (
                    <Check className="h-5 w-5 text-white" />
                  )}
                  {stepStatus === 'current' && (
                    <Circle className="h-5 w-5 text-white fill-white" />
                  )}
                  {stepStatus === 'pending' && (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  {stepStatus === 'approved' && (
                    <Check className="h-5 w-5 text-white" />
                  )}
                  {stepStatus === 'rejected' && (
                    <X className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p className={`text-sm ${
                    stepStatus === 'completed' || stepStatus === 'current' || stepStatus === 'approved' || stepStatus === 'rejected'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {isLast && isApproved ? 'Aprovado ✓' : ''}
                    {isLast && isRejected ? 'Recusado ✗' : ''}
                    {(!isLast || (!isApproved && !isRejected)) ? step.label : ''}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {isLast && (isApproved || isRejected) ? '' : step.description}
                  </p>
                </div>
              </div>

              {/* Line */}
              {index < statusSteps.length - 1 && (
                <div className={`
                  absolute top-5 left-1/2 w-full h-0.5 -z-0
                  ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}