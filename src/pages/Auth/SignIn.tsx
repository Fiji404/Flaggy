import { ErrorModal } from '@/components';
import { useSupabaseAuthStore } from '@/store/supabaseAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@radix-ui/react-label';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as z from 'zod';
import { Link } from '@/components/UI/Link';
import { Button } from '@/components/UI/Button';
import { OAuthProviders } from './OAuthProviders';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must contain at least 8 character(s)' })
});

export const framerFormAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 }
};

export const SignIn = () => {
    const navigate = useNavigate();
    const { user, authError, clearAuthError, signIn } = useSupabaseAuthStore();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    const formSubmitHandler = ({ email, password }: FormSchema) => {
        clearAuthError();
        signIn({ email, password });
    };

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    return (
        <main className="flex h-full grow items-center justify-center">
            {authError && <ErrorModal errorText={authError.message} closeModalHandler={clearAuthError} />}
            <motion.form
                {...framerFormAnimation}
                onSubmit={handleSubmit(formSubmitHandler)}
                method="post"
                className="mx-3 flex w-full max-w-[600px] flex-col gap-2 rounded-md border border-[#f1f1f1] bg-[rgb(253,253,253)] px-4 py-6 dark:border-[#202020] dark:bg-[#111]"
            >
                <h2 className="text-center text-4xl font-bold text-black dark:text-white">{t('Sign in')}</h2>
                <p className="mb-2 text-center text-lg text-[#494949] dark:text-[#969696]">
                    {t(
                        "Hello there 👋! We're excited to have you back. Please use your credentials to access your account and dive into our platform."
                    )}
                </p>
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
                <div className="mt-6 flex justify-between">
                    <Link to="/auth/signup">{t('Create account')}</Link>
                    <Button color="green">{t('Sign in')}</Button>
                </div>
                <div aria-hidden="true" className="mt-4 h-[2px] w-full rounded-full bg-[#eee] dark:bg-[#222222]" />
                <OAuthProviders />
            </motion.form>
        </main>
    );
};
