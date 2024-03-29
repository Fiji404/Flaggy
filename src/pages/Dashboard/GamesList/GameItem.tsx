import { Link } from '@/components/UI/Link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BsArrowRight } from 'react-icons/bs';
import { IoIosConstruct } from 'react-icons/io';
type GameAvailabilityStatus = 'available' | 'in-progress';

interface Props {
    name: string;
    desc: string;
    icon: React.ReactNode;
    status: GameAvailabilityStatus;
    route: string;
    i: number;
}

export const GameItem = ({ name, desc, icon, status, route, i }: Props) => {
    const { t } = useTranslation();
    return (
        <motion.li
            initial={{ opacity: 0, translateY: '-20px' }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: i * 0.35 }}
            className="flex max-w-2xl grow basis-96 flex-col items-center justify-between gap-2 rounded-md border bg-[#fff] p-4 text-center
            font-semibold text-black transition-colors  dark:border-[#303030] dark:bg-[rgb(19,19,19)] dark:text-white dark:hover:bg-[rgb(22,22,22)]"
        >
            <h2 className="flex items-center gap-2 text-4xl">
                {t(name)} {icon}
            </h2>
            <p className="text-xl font-normal text-[#5c5c5c] dark:text-[#888888]">{t(desc)}</p>
            <Link color={status === 'available' ? 'green' : 'warning'} className="ml-auto" to={route}>
                {status === 'available' ? (
                    <>
                        {t('Next')} <BsArrowRight className="text-[#2C4D3F] dark:text-[#3CDA8E]" />
                    </>
                ) : (
                    <>
                        {t('In progress')} <IoIosConstruct className="text-[#7D6523] dark:text-[#E6D62F]" />
                    </>
                )}
            </Link>
        </motion.li>
    );
};
