import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ExternalApiAccessible,
  UserSession,
  CreateOrUpdateSubscriberUseCase,
  CreateOrUpdateSubscriberCommand,
} from '@novu/application-generic';
import { ApiRateLimitCategoryEnum, SubscriberCustomData, UserSessionData } from '@novu/shared';
import { ApiCommonResponses, ApiResponse } from '../shared/framework/response.decorator';
import { UserAuthentication } from '../shared/framework/swagger/api.key.security';
import { ListSubscribersCommand } from './usecases/list-subscribers/list-subscribers.command';
import { ListSubscribersUseCase } from './usecases/list-subscribers/list-subscribers.usecase';
import { GetSubscriber } from './usecases/get-subscriber/get-subscriber.usecase';
import { GetSubscriberCommand } from './usecases/get-subscriber/get-subscriber.command';
import { PatchSubscriber } from './usecases/patch-subscriber/patch-subscriber.usecase';
import { PatchSubscriberCommand } from './usecases/patch-subscriber/patch-subscriber.command';
import { GetSubscriberPreferences } from './usecases/get-subscriber-preferences/get-subscriber-preferences.usecase';
import { GetSubscriberPreferencesCommand } from './usecases/get-subscriber-preferences/get-subscriber-preferences.command';
import { ListSubscribersQueryDto } from './dtos/list-subscribers-query.dto';
import { ListSubscribersResponseDto } from './dtos/list-subscribers-response.dto';
import { SdkGroupName, SdkMethodName } from '../shared/framework/swagger/sdk.decorators';
import { DirectionEnum } from '../shared/dtos/base-responses';
import { PatchSubscriberRequestDto } from './dtos/patch-subscriber.dto';
import { SubscriberResponseDto } from '../subscribers/dtos';
import { RemoveSubscriberCommand } from './usecases/remove-subscriber/remove-subscriber.command';
import { RemoveSubscriber } from './usecases/remove-subscriber/remove-subscriber.usecase';
import { RemoveSubscriberResponseDto } from './dtos/remove-subscriber.dto';
import { GetSubscriberPreferencesDto } from './dtos/get-subscriber-preferences.dto';
import { PatchSubscriberPreferencesDto } from './dtos/patch-subscriber-preferences.dto';
import { UpdateSubscriberPreferencesCommand } from './usecases/update-subscriber-preferences/update-subscriber-preferences.command';
import { UpdateSubscriberPreferences } from './usecases/update-subscriber-preferences/update-subscriber-preferences.usecase';
import { ThrottlerCategory } from '../rate-limiting/guards/throttler.decorator';
import { CreateSubscriberRequestDto } from './dtos/create-subscriber.dto';
import { mapSubscriberEntityToDto } from './usecases/list-subscribers/map-subscriber-entity-to.dto';

@ThrottlerCategory(ApiRateLimitCategoryEnum.CONFIGURATION)
@Controller({ path: '/subscribers', version: '2' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Subscribers')
@SdkGroupName('Subscribers')
@ApiCommonResponses()
export class SubscribersController {
  constructor(
    private listSubscribersUsecase: ListSubscribersUseCase,
    private getSubscriberUsecase: GetSubscriber,
    private patchSubscriberUsecase: PatchSubscriber,
    private removeSubscriberUsecase: RemoveSubscriber,
    private getSubscriberPreferencesUsecase: GetSubscriberPreferences,
    private updateSubscriberPreferencesUsecase: UpdateSubscriberPreferences,
    private createOrUpdateSubscriberUsecase: CreateOrUpdateSubscriberUseCase
  ) {}

  @Get('')
  @UserAuthentication()
  @ExternalApiAccessible()
  @SdkMethodName('search')
  @ApiOperation({ summary: 'Search for subscribers' })
  @ApiResponse(ListSubscribersResponseDto)
  async searchSubscribers(
    @UserSession() user: UserSessionData,
    @Query() query: ListSubscribersQueryDto
  ): Promise<ListSubscribersResponseDto> {
    return await this.listSubscribersUsecase.execute(
      ListSubscribersCommand.create({
        user,
        limit: Number(query.limit || '10'),
        after: query.after,
        before: query.before,
        orderDirection: query.orderDirection || DirectionEnum.DESC,
        orderBy: query.orderBy || '_id',
        email: query.email,
        phone: query.phone,
        subscriberId: query.subscriberId,
        name: query.name,
        includeCursor: query.includeCursor,
      })
    );
  }

  @Get('/:subscriberId')
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Get subscriber',
    description: 'Get subscriber by your internal id used to identify the subscriber',
  })
  @ApiResponse(SubscriberResponseDto)
  @SdkMethodName('retrieve')
  async getSubscriber(
    @UserSession() user: UserSessionData,
    @Param('subscriberId') subscriberId: string
  ): Promise<SubscriberResponseDto> {
    return await this.getSubscriberUsecase.execute(
      GetSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
      })
    );
  }

  @Post('')
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Create subscriber',
    description: 'Create subscriber with the given data',
  })
  @ApiResponse(SubscriberResponseDto, 201)
  @SdkMethodName('create')
  async createSubscriber(
    @UserSession() user: UserSessionData,
    @Body() body: CreateSubscriberRequestDto
  ): Promise<SubscriberResponseDto> {
    const subscriberEntity = await this.createOrUpdateSubscriberUsecase.execute(
      CreateOrUpdateSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId: body.subscriberId,
        email: body.email || undefined,
        firstName: body.firstName || undefined,
        lastName: body.lastName || undefined,
        phone: body.phone || undefined,
        avatar: body.avatar || undefined,
        locale: body.locale || undefined,
        timezone: body.timezone || undefined,
        // TODO: Change shared type to
        data: (body.data || {}) as SubscriberCustomData,
        /*
         * TODO: In Subscriber V2 API endpoint we haven't added channels yet.
         * channels: body.channels || [],
         */
      })
    );

    return mapSubscriberEntityToDto(subscriberEntity);
  }

  @Patch('/:subscriberId')
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Patch subscriber',
    description: 'Patch subscriber by your internal id used to identify the subscriber',
  })
  @ApiResponse(SubscriberResponseDto)
  @SdkMethodName('patch')
  async patchSubscriber(
    @UserSession() user: UserSessionData,
    @Param('subscriberId') subscriberId: string,
    @Body() body: PatchSubscriberRequestDto
  ): Promise<SubscriberResponseDto> {
    return await this.patchSubscriberUsecase.execute(
      PatchSubscriberCommand.create({
        subscriberId,
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        patchSubscriberRequestDto: body,
        userId: user._id,
      })
    );
  }

  @Delete('/:subscriberId')
  @ApiResponse(RemoveSubscriberResponseDto, 200)
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Delete subscriber',
    description: 'Deletes a subscriber entity from the Novu platform',
  })
  @SdkMethodName('delete')
  async removeSubscriber(
    @UserSession() user: UserSessionData,
    @Param('subscriberId') subscriberId: string
  ): Promise<RemoveSubscriberResponseDto> {
    return await this.removeSubscriberUsecase.execute(
      RemoveSubscriberCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
      })
    );
  }

  @Get('/:subscriberId/preferences')
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Get subscriber preferences',
    description: 'Get subscriber global and workflow specific preferences',
  })
  @ApiResponse(GetSubscriberPreferencesDto)
  @SdkGroupName('Subscribers.Preferences')
  @SdkMethodName('list')
  async getSubscriberPreferences(
    @UserSession() user: UserSessionData,
    @Param('subscriberId') subscriberId: string
  ): Promise<GetSubscriberPreferencesDto> {
    return await this.getSubscriberPreferencesUsecase.execute(
      GetSubscriberPreferencesCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
      })
    );
  }

  @Patch('/:subscriberId/preferences')
  @UserAuthentication()
  @ExternalApiAccessible()
  @ApiOperation({
    summary: 'Update subscriber global or workflow specific preferences',
    description: 'Update subscriber global or workflow specific preferences',
  })
  @ApiResponse(GetSubscriberPreferencesDto)
  @SdkGroupName('Subscribers.Preferences')
  @SdkMethodName('update')
  async updateSubscriberPreferences(
    @UserSession() user: UserSessionData,
    @Param('subscriberId') subscriberId: string,
    @Body() body: PatchSubscriberPreferencesDto
  ): Promise<GetSubscriberPreferencesDto> {
    return await this.updateSubscriberPreferencesUsecase.execute(
      UpdateSubscriberPreferencesCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        subscriberId,
        workflowIdOrInternalId: body.workflowId,
        channels: body.channels,
      })
    );
  }
}
