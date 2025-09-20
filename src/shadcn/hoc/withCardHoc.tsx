import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

export type WithCardProps = {
  cardTitle?: string;
  cardDescription?: string;
};

export function withCardHoc<P extends object>(
  Component: React.FC<P>,
): React.FC<P & WithCardProps> {
  return function WithCardComponent({ cardTitle, cardDescription, ...props }) {
    return (
      <Card data-element-card>
        <CardHeader data-element-card-header>
          <CardTitle data-element-card-title>{cardTitle}</CardTitle>
          <CardDescription data-element-card-description>
            {cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent data-element-card-content>
          <Component {...(props as P)} />
        </CardContent>
      </Card>
    );
  };
}
