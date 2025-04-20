import React from 'react';
import { useGalleryDrawer } from '@/hooks/use-modal-gallery';
import { Button } from './ui/button';


const ButtonSeeMore = (data: any) => {
    const handler = useGalleryDrawer();

    return (
        <Button
            variant='link'
            className='text-black dark:text-white '
            onClick={
                () => { 
                    handler.onOpen(data, data.drawer) 
                }              
            }
        >
            Ver mais
        </Button>
    )
}

export default ButtonSeeMore