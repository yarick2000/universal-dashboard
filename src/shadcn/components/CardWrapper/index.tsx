import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';

type CardWrapperProps = React.ComponentProps<typeof Card> & {
  title: string;
  description: string;
};

export function CardWrapper({ title, description, children }: CardWrapperProps) {
  return (
    <Card data-element-card>
      <CardHeader data-element-card-header>
        <CardTitle data-element-card-title>{title}</CardTitle>
        <CardDescription data-element-card-description>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent data-element-card-content>
        {children}
      </CardContent>
    </Card>
  );
}
