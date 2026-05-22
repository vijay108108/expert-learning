export const demoModalEventName = "open-demo-modal";

export type DemoModalPayload = {
  course?: string;
  source?: string;
  message?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
};
