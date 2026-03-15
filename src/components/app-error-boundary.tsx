import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "未知运行错误",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AppErrorBoundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="runtime-fallback">
          <div className="runtime-card">
            <h2>3D 展示加载失败</h2>
            <p>
              页面已经打开，但中间的 3D 展示在运行时发生错误，所以这里显示了兜底页，避免出现整块空白。
            </p>
            <code>{this.state.message}</code>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
