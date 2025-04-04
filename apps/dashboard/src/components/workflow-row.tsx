import { PAUSE_MODAL_TITLE, PauseModalDescription } from '@/components/pause-workflow-dialog';
import { Badge } from '@/components/primitives/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/primitives/dropdown-menu';
import { TableCell, TableRow } from '@/components/primitives/table';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@/components/primitives/tooltip';
import TruncatedText from '@/components/truncated-text';
import { WorkflowStatus } from '@/components/workflow-status';
import { WorkflowSteps } from '@/components/workflow-steps';
import { WorkflowTags } from '@/components/workflow-tags';
import { LEGACY_DASHBOARD_URL } from '@/config';
import { useAuth } from '@/context/auth/hooks';
import { useEnvironment, useFetchEnvironments } from '@/context/environment/hooks';
import { useDeleteWorkflow } from '@/hooks/use-delete-workflow';
import { usePatchWorkflow } from '@/hooks/use-patch-workflow';
import { useSyncWorkflow } from '@/hooks/use-sync-workflow';
import { WorkflowOriginEnum, WorkflowStatusEnum } from '@/utils/enums';
import { formatDateSimple } from '@/utils/format-date';
import { buildRoute, ROUTES } from '@/utils/routes';
import { cn } from '@/utils/ui';
import { IEnvironment, WorkflowListResponseDto } from '@novu/shared';
import { ComponentProps, useState } from 'react';
import { FaCode } from 'react-icons/fa6';
import {
  RiDeleteBin2Line,
  RiFlashlightLine,
  RiGitPullRequestFill,
  RiMore2Fill,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiPulseFill,
} from 'react-icons/ri';

import { FilesIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { type ExternalToast } from 'sonner';
import { ConfirmationModal } from './confirmation-modal';
import { DeleteWorkflowDialog } from './delete-workflow-dialog';
import { CompactButton } from './primitives/button-compact';
import { CopyButton } from './primitives/copy-button';
import { ToastIcon } from './primitives/sonner';
import { showToast } from './primitives/sonner-helpers';
import { TimeDisplayHoverCard } from './time-display-hover-card';

type WorkflowRowProps = {
  workflow: WorkflowListResponseDto;
};

const toastOptions: ExternalToast = {
  position: 'bottom-right',
  classNames: {
    toast: 'mb-4 right-0',
  },
};

type WorkflowLinkTableCellProps = ComponentProps<typeof TableCell>;

const WorkflowLinkTableCell = (props: WorkflowLinkTableCellProps) => {
  const { children, className, ...rest } = props;

  return (
    <TableCell className={cn('group-hover:bg-neutral-alpha-50 relative', className)} {...rest}>
      {children}
      <span className="sr-only">Edit workflow</span>
    </TableCell>
  );
};

export const WorkflowRow = ({ workflow }: WorkflowRowProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const { currentEnvironment } = useEnvironment();
  const navigate = useNavigate();
  const { safeSync, isSyncable, tooltipContent, PromoteConfirmModal } = useSyncWorkflow(workflow);
  const isV1Workflow = workflow.origin === WorkflowOriginEnum.NOVU_CLOUD_V1;
  const workflowLink = isV1Workflow
    ? buildRoute(`${LEGACY_DASHBOARD_URL}/workflows/edit/:workflowId`, {
        workflowId: workflow._id,
      })
    : buildRoute(ROUTES.EDIT_WORKFLOW, {
        environmentSlug: currentEnvironment?.slug ?? '',
        workflowSlug: workflow.slug,
      });
  const triggerWorkflowLink = isV1Workflow
    ? buildRoute(`${LEGACY_DASHBOARD_URL}/workflows/edit/:workflowId/test-workflow`, { workflowId: workflow._id })
    : buildRoute(ROUTES.TEST_WORKFLOW, {
        environmentSlug: currentEnvironment?.slug ?? '',
        workflowSlug: workflow.slug,
      });

  const { deleteWorkflow, isPending: isDeleteWorkflowPending } = useDeleteWorkflow({
    onSuccess: () => {
      showToast({
        children: () => (
          <>
            <ToastIcon variant="success" />
            <span className="text-sm">
              Deleted workflow <span className="font-bold">{workflow.name}</span>.
            </span>
          </>
        ),
        options: toastOptions,
      });
    },
    onError: () => {
      showToast({
        children: () => (
          <>
            <ToastIcon variant="error" />
            <span className="text-sm">
              Failed to delete workflow <span className="font-bold">{workflow.name}</span>.
            </span>
          </>
        ),
        options: toastOptions,
      });
    },
  });

  const { patchWorkflow, isPending: isPauseWorkflowPending } = usePatchWorkflow({
    onSuccess: (data) => {
      showToast({
        children: () => (
          <>
            <ToastIcon variant="success" />
            <span className="text-sm">
              {data.active ? 'Enabled' : 'Paused'} workflow <span className="font-bold">{workflow.name}</span>.
            </span>
          </>
        ),
        options: toastOptions,
      });
    },
    onError: (_, { workflow }) => {
      showToast({
        children: () => (
          <>
            <ToastIcon variant="error" />
            <span className="text-sm">
              Failed to {workflow.active ? 'enable' : 'pause'} workflow{' '}
              <span className="font-bold">{workflow.name}</span>.
            </span>
          </>
        ),
        options: toastOptions,
      });
    },
  });

  const onDeleteWorkflow = async () => {
    await deleteWorkflow({
      workflowSlug: workflow.slug,
    });
  };

  const onPauseWorkflow = async () => {
    await patchWorkflow({
      workflowSlug: workflow.slug,
      workflow: {
        active: workflow.status === WorkflowStatusEnum.ACTIVE ? false : true,
      },
    });
  };

  const handlePauseWorkflow = () => {
    if (workflow.status === WorkflowStatusEnum.ACTIVE) {
      setTimeout(() => setIsPauseModalOpen(true), 0);
      return;
    }

    onPauseWorkflow();
  };

  const handleRowClick = () => {
    if (isV1Workflow) {
      document.location.href = workflowLink;
    } else {
      navigate(workflowLink);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    // don't propagate the click event to the row
    e.stopPropagation();
  };

  return (
    <>
      <TableRow key={workflow._id} className="group relative isolate cursor-pointer" onClick={handleRowClick}>
        <WorkflowLinkTableCell className="font-medium">
          <div className="flex items-center gap-1">
            {workflow.origin === WorkflowOriginEnum.EXTERNAL && (
              <Badge color="yellow" size="sm" variant="lighter">
                <FaCode className="size-3" />
              </Badge>
            )}
            <TruncatedText className="max-w-[32ch]">{workflow.name}</TruncatedText>
          </div>
          <div className="flex items-center gap-1 transition-opacity duration-200">
            <TruncatedText className="text-foreground-400 font-code block text-xs">{workflow.workflowId}</TruncatedText>

            <CopyButton
              className="z-10 flex size-2 p-0 px-1 opacity-0 group-hover:opacity-100"
              valueToCopy={workflow.workflowId}
              size="2xs"
            />
          </div>
        </WorkflowLinkTableCell>
        <WorkflowLinkTableCell className="min-w-[200px]">
          <WorkflowStatus status={workflow.status} />
        </WorkflowLinkTableCell>
        <WorkflowLinkTableCell>
          <WorkflowSteps steps={workflow.stepTypeOverviews} />
        </WorkflowLinkTableCell>
        <WorkflowLinkTableCell>
          <WorkflowTags tags={workflow.tags || []} />
        </WorkflowLinkTableCell>

        <WorkflowLinkTableCell className="text-foreground-600 text-sm font-medium">
          <TimeDisplayHoverCard date={new Date(workflow.updatedAt)}>
            {formatDateSimple(workflow.updatedAt)}
          </TimeDisplayHoverCard>
        </WorkflowLinkTableCell>
        {/* <WorkflowLinkTableCell  className="text-foreground-600 text-sm font-medium">
        {workflow.lastTriggeredAt ? (
          <TimeDisplayHoverCard date={workflow.lastTriggeredAt}>
            {formatDateSimple(workflow.lastTriggeredAt)}
          </TimeDisplayHoverCard>
        ) : null}
      </WorkflowLinkTableCell> */}

        <WorkflowLinkTableCell className="w-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CompactButton
                icon={RiMore2Fill}
                variant="ghost"
                className="z-10 h-8 w-8 p-0"
                data-testid="workflow-actions-menu"
              ></CompactButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" onClick={stopPropagation}>
              <DropdownMenuGroup>
                <Link to={triggerWorkflowLink} reloadDocument={isV1Workflow}>
                  <DropdownMenuItem className="cursor-pointer">
                    <RiPlayCircleLine />
                    Trigger workflow
                  </DropdownMenuItem>
                </Link>
                <SyncWorkflowMenuItem
                  currentEnvironment={currentEnvironment}
                  isSyncable={isSyncable}
                  tooltipContent={tooltipContent}
                  onSync={safeSync}
                />
                <Link
                  to={
                    buildRoute(ROUTES.ACTIVITY_FEED, {
                      environmentSlug: currentEnvironment?.slug ?? '',
                    }) +
                    '?' +
                    new URLSearchParams({ workflows: workflow._id }).toString()
                  }
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <RiPulseFill />
                    View activity
                  </DropdownMenuItem>
                </Link>
                <Link
                  to={buildRoute(ROUTES.WORKFLOWS_DUPLICATE, {
                    environmentSlug: currentEnvironment?.slug ?? '',
                    workflowId: workflow.workflowId,
                  })}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <FilesIcon />
                    Duplicate workflow
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="*:cursor-pointer">
                <DropdownMenuItem
                  onClick={handlePauseWorkflow}
                  disabled={workflow.status === WorkflowStatusEnum.ERROR}
                  data-testid={workflow.status === WorkflowStatusEnum.ACTIVE ? 'pause-workflow' : 'enable-workflow'}
                >
                  {workflow.status === WorkflowStatusEnum.ACTIVE ? (
                    <>
                      <RiPauseCircleLine />
                      Pause workflow
                    </>
                  ) : (
                    <>
                      <RiFlashlightLine />
                      Enable workflow
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={workflow.origin === WorkflowOriginEnum.EXTERNAL}
                  onClick={() => {
                    setTimeout(() => setIsDeleteModalOpen(true), 0);
                  }}
                  data-testid="delete-workflow"
                >
                  <RiDeleteBin2Line />
                  Delete workflow
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </WorkflowLinkTableCell>
      </TableRow>
      <DeleteWorkflowDialog
        workflow={workflow}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={onDeleteWorkflow}
        isLoading={isDeleteWorkflowPending}
      />
      <ConfirmationModal
        open={isPauseModalOpen}
        onOpenChange={setIsPauseModalOpen}
        onConfirm={async () => {
          await onPauseWorkflow();
          setIsPauseModalOpen(false);
        }}
        title={PAUSE_MODAL_TITLE}
        description={<PauseModalDescription workflowName={workflow.name} />}
        confirmButtonText="Proceed"
        isLoading={isPauseWorkflowPending}
      />
      <PromoteConfirmModal />
    </>
  );
};

const SyncWorkflowMenuItem = ({
  currentEnvironment,
  isSyncable,
  tooltipContent,
  onSync,
}: {
  currentEnvironment: IEnvironment | undefined;
  isSyncable: boolean;
  tooltipContent: string | undefined;
  onSync: (targetEnvironmentId: string) => void;
}) => {
  const { currentOrganization } = useAuth();
  const { environments = [] } = useFetchEnvironments({ organizationId: currentOrganization?._id });
  const otherEnvironments = environments.filter((env: IEnvironment) => env._id !== currentEnvironment?._id);

  if (!isSyncable) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenuItem disabled>
            <RiGitPullRequestFill />
            Sync workflow
          </DropdownMenuItem>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    );
  }

  if (otherEnvironments.length === 1) {
    return (
      <DropdownMenuItem onClick={() => onSync(otherEnvironments[0]._id)}>
        <RiGitPullRequestFill />
        {`Sync to ${otherEnvironments[0].name}`}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="gap-2">
        <RiGitPullRequestFill />
        Sync workflow
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {otherEnvironments.map((env) => (
            <DropdownMenuItem key={env._id} onClick={() => onSync(env._id)}>
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
