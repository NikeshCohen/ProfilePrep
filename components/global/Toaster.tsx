import { Toaster as ReactHotToast, ToasterProps } from "react-hot-toast";

export default function Toaster(props: ToasterProps) {
  return (
    <ReactHotToast
      {...props}
      position={props.position || "top-right"}
      toastOptions={{
        ...props.toastOptions,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          ...props.toastOptions?.style,
        },
        success: {
          ...props.toastOptions?.success,
          iconTheme: {
            primary: "hsl(142, 76%, 36%)",
            secondary: "hsl(var(--primary-foreground))",
            ...props.toastOptions?.success?.iconTheme,
          },
        },
        error: {
          ...props.toastOptions?.error,
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))",
            ...props.toastOptions?.error?.iconTheme,
          },
        },
      }}
    />
  );
}
