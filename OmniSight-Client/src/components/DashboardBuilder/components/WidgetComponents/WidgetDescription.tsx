
import React from "react";
import { CardFooter } from "@/components/ui/card";

interface WidgetDescriptionProps {
  description: string;
}

const WidgetDescription: React.FC<WidgetDescriptionProps> = ({ description }) => {
  return (
    <CardFooter className="p-4 pt-0">
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardFooter>
  );
};

export default WidgetDescription;
