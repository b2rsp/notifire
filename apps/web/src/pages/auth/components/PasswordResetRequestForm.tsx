import { useMutation } from '@tanstack/react-query';
import { captureException } from '@sentry/react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Center } from '@mantine/core';
import { Button, colors, Input, Text } from '@novu/design-system';
import type { IResponseError } from '@novu/shared';

import { api } from '../../../api/api.client';
import { ROUTES } from '../../../constants/routes';

type Props = {
  onSent: () => void;
};

export function PasswordResetRequestForm({ onSent }: Props) {
  const { isLoading, mutateAsync, isError, error } = useMutation<
    { success: boolean },
    IResponseError,
    {
      email: string;
    }
  >((data) => api.post(`/v1/auth/reset/request`, data));

  const onForgotPassword = async (data) => {
    const itemData = {
      email: data.email,
    };

    try {
      await mutateAsync(itemData);
      onSent();
    } catch (e: any) {
      if (e.statusCode !== 400) {
        captureException(e);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  return (
    <>
      <form noValidate name="reset-form" onSubmit={handleSubmit(onForgotPassword)}>
        <Input
          error={errors.email?.message as string}
          {...register('email', {
            required: 'Please provide an email',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please provide a valid email' },
          })}
          required
          label="Email"
          placeholder="Type your email..."
          data-test-id="email"
          mt={20}
        />
        <Button mt={60} inherit loading={isLoading} submit data-test-id="submit-btn">
          Reset Password
        </Button>
        <Center mt={20}>
          <Text mr={10} size="md" color={colors.B60}>
            Know your password?
          </Text>
          <Link to={ROUTES.AUTH_LOGIN}>
            <Text gradient>Sign In</Text>
          </Link>
        </Center>
      </form>
      {isError && error?.message && (
        <Text mt={20} size="lg" weight="bold" align="center" color={colors.error}>
          {error.message}
        </Text>
      )}
    </>
  );
}
