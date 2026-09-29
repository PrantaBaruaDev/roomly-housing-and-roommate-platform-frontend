import { PublicShell } from '@/components/layout/public-shell';
import { ReactNode } from 'react';

const PublicLayout = ({ children }: { children: ReactNode}) => {
    return <PublicShell children={children} />
};

export default PublicLayout;