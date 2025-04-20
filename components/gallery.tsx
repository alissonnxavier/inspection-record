'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState, MouseEvent, useMemo } from 'react';
import { SerigraphyDescription } from './serigraphy-description';
import { ScrollArea } from './ui/scroll-area';
import { loadUniquePlateRegister, loadUniqueSerigraphyRegister } from '@/actions/load';
import { GridLoader } from 'react-spinners';
import { PlateDescription } from './plate-description';

const MAGNIFIER_SIZE = 300;
const ZOOM_LEVEL = 3;

interface GalleryProps {
    data: any;
    drawer: string;
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {

    const [inspectionData, setInspectionData] = useState([] as any);
    const [imgOnPreview, setImgOnPreview] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);

    const [zoomable, setZoomable] = useState(true);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [position, setPosition] = useState({ x: 100, y: 100, mouseX: 0, mouseY: 0 });

    console.log(inspectionData)


    const handleMouseEnter = (e: MouseEvent) => {
        let element = e.currentTarget;
        let { width, height } = element.getBoundingClientRect();
        setImageSize({ width, height });
        setZoomable(true);
        updatePosition(e);
    };

    const handleMouseLeave = (e: MouseEvent) => {
        setZoomable(false);
        updatePosition(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        updatePosition(e);
    };

    const updatePosition = (e: MouseEvent) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - left;
        let y = e.clientY - top;
        setPosition({
            x: -x * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
            y: -y * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
            mouseX: x - (MAGNIFIER_SIZE / 2),
            mouseY: y - (MAGNIFIER_SIZE / 2),
        });
    };

    const handleSubmit = async () => {
        try {
            if (data.drawer === "serigraphy") {
                loadUniqueSerigraphyRegister(data.data as string)
                    .then((response) => {
                        setInspectionData(response as any);
                    });
            } else {
                loadUniquePlateRegister(data.data as string)
                    .then((response) => {
                        setInspectionData(response as any);
                    });
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleSubmit();
    }, [setInspectionData]);

    if (!inspectionData[0]?.base64[0]) {
        return (
            <>
                <div className="flex justify-center p-10">
                </div>
                <div className="flex h-5/6 justify-center items-center m-auto">
                    <GridLoader color="#9e0837" size={100} />
                </div>
            </>
        )
    }

    return (
        <ScrollArea className='xl:m-auto lg:m-auto 2xl:m-auto md:m-auto'>
            <div className='flex flex-wrap m-auto'>
                <div className='m-auto'>
                    <div className=' h-5/6 '>
                        <div
                            onMouseLeave={handleMouseLeave}
                            onMouseEnter={handleMouseEnter}
                            onMouseMove={handleMouseMove}
                            className='relative align-middle m-auto overflow-hidden h-full '
                        >
                            <div className='flex items-center justify-center align-middle h-[42rem] border rounded-lg'>
                                <Image
                                    key='234'
                                    alt='pictures'
                                    src={!imgOnPreview ? inspectionData[0]?.base64[0] : imgOnPreview}
                                    width={500}
                                    height={500}
                                    className="relative rounded-lg aspect-auto "
                                    priority
                                />
                            </div>
                            <div
                                style={{
                                    backgroundPosition: `${position.x}px ${position.y}px`,
                                    backgroundImage: `url(${!imgOnPreview ? inspectionData[0]?.base64[0] : imgOnPreview})`,
                                    backgroundSize: `${imageSize.width * ZOOM_LEVEL}px ${imageSize.height * ZOOM_LEVEL}px`,
                                    backgroundRepeat: 'no-repeat',
                                    display: zoomable ? 'block' : 'none',
                                    top: `${position.mouseY}px`,
                                    left: `${position.mouseX}px`,
                                    width: `${MAGNIFIER_SIZE}px`,
                                    height: `${MAGNIFIER_SIZE}px`,
                                }}
                                className={`z-50 rounded-full pointer-events-none absolute border-gray-500`}
                            />
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2 m-3'>
                        {inspectionData[0]?.base64.map((image: any, index: any) => (
                            <div
                                className={`
                            hover:scale-90
                            transition-transform
                            border
                            flex aspect-square 
                            relative
                            shadow-lg
                            hover:shadow-none
                            rounded-lg
                            overflow-hidden
                            ${currentIndex == index as any ? 'border-red-600 scale-90 shadow-none' : ''}
                        `}
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index as any)
                                    setImgOnPreview(inspectionData[0]?.base64[index])
                                }}
                            >
                                <Image
                                    alt='pictures'
                                    src={image}
                                    width={100}
                                    height={100}
                                    className="object-cover object-center"
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='lg:mt-0 m-auto sm:mt-10 lg:ml-5 md:m-auto md:mt-10'>
                    {data.drawer === "serigraphy" &&
                        <SerigraphyDescription
                            data={inspectionData}
                        />
                    }
                    {data.drawer === "plate" &&
                        <PlateDescription
                            data={inspectionData}
                        />
                    }
                </div>
            </div>
        </ScrollArea>
    )
}

export default Gallery