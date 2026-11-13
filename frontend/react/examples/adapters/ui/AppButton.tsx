import { Button } from 'antd';
import type { ButtonProps } from 'antd';

export type AppButtonProps = ButtonProps;

export function AppButton(props: AppButtonProps) {
  return <Button size="middle" {...props} />;
}
