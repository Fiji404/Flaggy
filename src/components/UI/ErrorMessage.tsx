import { FaXmark } from 'react-icons/fa6';

interface Props {
    message?: string;
}

export const ErrorMessage = ({ message }: Props) => {
    return (
        <p className="flex items-center gap-1 text-red-500">
            <FaXmark className="text-red-500" />
            {message}
        </p>
    );
};
