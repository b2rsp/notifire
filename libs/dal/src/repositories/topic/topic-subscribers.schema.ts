import mongoose, { Schema } from 'mongoose';

import { TopicSubscribersDBModel } from './topic-subscribers.entity';

import { schemaOptions } from '../schema-default.options';

const topicSubscribersSchema = new Schema<TopicSubscribersDBModel>(
  {
    _environmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Environment',
      index: true,
      required: true,
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
      required: true,
    },
    _subscriberId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscriber',
      index: true,
      required: true,
    },
    _topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      index: true,
      required: true,
    },
    topicKey: {
      type: Schema.Types.String,
      index: true,
      required: true,
    },
    externalSubscriberId: Schema.Types.String,
  },
  schemaOptions
);

topicSubscribersSchema.index({
  _environmentId: 1,
});

topicSubscribersSchema.index({
  _subscriberId: 1,
});

topicSubscribersSchema.index({
  _topicId: 1,
});

topicSubscribersSchema.index({
  topicKey: 1,
});

export const TopicSubscribers =
  (mongoose.models.TopicSubscribers as mongoose.Model<TopicSubscribersDBModel>) ||
  mongoose.model<TopicSubscribersDBModel>('TopicSubscribers', topicSubscribersSchema);
