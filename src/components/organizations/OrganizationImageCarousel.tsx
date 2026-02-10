"use client";

import "@mantine/carousel/styles.css";

import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Card, CardSection, Image } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface OrganizationImageCarouselProps {
  imageUrls: string[];
  organizationName: string;
}

export function OrganizationImageCarousel({
  imageUrls,
  organizationName,
}: OrganizationImageCarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  // If only one image, show it without carousel
  if (imageUrls.length === 1) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <CardSection>
          <Image
            src={imageUrls[0]}
            height={300}
            alt={organizationName}
            fallbackSrc="https://placehold.co/800x300?text=No+Image"
          />
        </CardSection>
      </Card>
    );
  }

  // Multiple images - show carousel with autoplay and loop
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection>
        <Carousel
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          height={300}
          emblaOptions={{
            loop: true,
          }}
        >
          {imageUrls.map((url, index) => (
            <CarouselSlide key={index}>
              <Image
                src={url}
                height={300}
                alt={`${organizationName} - Image ${index + 1}`}
                fallbackSrc="https://placehold.co/800x300?text=No+Image"
              />
            </CarouselSlide>
          ))}
        </Carousel>
      </CardSection>
    </Card>
  );
}
