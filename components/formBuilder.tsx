import React from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormBuilderProps {
  name: string;
  label: string;
  children: React.ReactNode;
  description?: string | null;
  message?: boolean;
  control?: any;
  messageClassName?: string;
  descriptionClassName?: string;
  labelClassName?: string;
  [key: string]: any;
}

export const FormBuilder = ({
  name,
  label,
  children,
  description = null,
  message,
  control = undefined,
  messageClassName,
  descriptionClassName,
  labelClassName,
  ...rest
}: FormBuilderProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({
        field,
      }: {
        field: { value: any; onChange: any; onBlur: any };
      }) => (
        <FormItem {...rest}>
          <FormLabel htmlFor={name} className={cn("", labelClassName)}>
            {label}
          </FormLabel>
          <FormControl>
            {React.isValidElement(children) ? (
              React.cloneElement(children, field)
            ) : (
              <>{children}</>
            )}
          </FormControl>
          {message && <FormMessage className={cn("", messageClassName)} />}
          {description && (
            <FormDescription className={cn("", descriptionClassName)}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};

interface FormBuilderWIthIconsProps extends FormBuilderProps {
  icon: React.ReactNode;
  iconClassName?: string;
  endIcon?: React.ReactNode;
  required?: boolean;
}
export const FormBuilderWithIcons = ({
  name,
  label,
  children,
  description,
  message,
  control,
  messageClassName,
  descriptionClassName,
  labelClassName,
  icon,
  iconClassName,
  endIcon,
  required,
  ...rest
}: FormBuilderWIthIconsProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem {...rest}>
          <FormLabel htmlFor={name} className={cn("", labelClassName)}>
            {label}
            {required && (
              <span className="text-destructive font-thin ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {React.isValidElement(icon)
                ? React.cloneElement(icon, {
                    ...(icon.props as any),
                    className: cn(
                      "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                      iconClassName
                    ),
                  })
                : icon}
              {React.isValidElement(children) ? (
                React.cloneElement(children, field)
              ) : (
                <>{children}</>
              )}
              {endIcon}
            </div>
          </FormControl>
          {message && <FormMessage className={cn("", messageClassName)} />}
          {description && (
            <FormDescription className={cn("", descriptionClassName)}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};
