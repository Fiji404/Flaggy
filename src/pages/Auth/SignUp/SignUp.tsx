import { ErrorModal } from '@/components';
import { Button } from '@/components/UI/Button';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { useSupabaseAuthStore } from '@/store/supabaseAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatars } from './Avatars/Avatars';
import { createPortal } from 'react-dom';
import { SignUpConfirmationModal } from './SignUpConfirmationModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
    username: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must contain at least 8 character(s)' })
});

export const SignUp = () => {
    const { user, session, authError, clearAuthError, signUp } = useSupabaseAuthStore();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitted }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });
    const [isConfirmationModalClosed, setIsConfirmationModalClosed] = useState(false);
    const [activeAvatarURL, setActiveAvatarURL] = useState('');

    const formSubmitHandler = ({ email, password, username }: FormSchema) => {
        clearAuthError();
        signUp({ email, password, username, avatarURL: activeAvatarURL });
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalClosed(true);
    };

    const saveActiveAvatarURL = (avatarURL: string) => {
        setActiveAvatarURL(avatarURL);
    };

    return (
        <main className="flex h-full grow items-center justify-center">
            {authError && <ErrorModal errorText={authError.message} closeModalHandler={clearAuthError} />}
            {user &&
                !session &&
                isSubmitted &&
                !isConfirmationModalClosed &&
                createPortal(
                    <SignUpConfirmationModal
                        closeConfirmationModal={closeConfirmationModal}
                        emailToConfirm={getValues().email}
                    />,
                    document.body
                )}
            <form
                onSubmit={handleSubmit(formSubmitHandler)}
                method="post"
                className="flex w-full max-w-[600px] flex-col gap-2 rounded-md border border-[#f1f1f1] bg-[rgb(253,253,253)] px-4 py-6 dark:border-[#313131] dark:bg-[#111]"
            >
                <h2 className="text-center text-4xl font-bold text-black dark:text-white">{t('Sign up')}</h2>
                <p className="mb-2 text-center text-lg text-[#494949] dark:text-[#969696]">
                    {t(
                        "Hello there 👋! We're excited to have you back. Please use your credentials to access your account and dive into our platform."
                    )}
                </p>
                <Label className="form-label">{t('Avatar')}</Label>
                <Avatars activeAvatarURL={activeAvatarURL} saveActiveAvatarURL={saveActiveAvatarURL} />
                <Label className="form-label">
                    {t('Username')}
                    <input className="form-input" {...register('username')} />
                </Label>
                {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                <Label className="form-label">
                    E-mail
                    <input className="form-input" {...register('email')} />
                </Label>
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                <Label className="form-label">
                    {t('Password')}
                    <input className="form-input" type="text" {...register('password')} />
                </Label>
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                <Button color="green" className="mt-6">
                    {t('Sign up')}
                </Button>
            </form>
        </main>
    );
};
