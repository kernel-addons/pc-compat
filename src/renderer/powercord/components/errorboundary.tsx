import DiscordModules, {promise} from "@modules/discord";
import {fromPromise} from "./asynccomponent";
import ErrorState from "./errorstate";

const ErrorBoundary = fromPromise(promise.then(() => {
    return class ErrorBoundary extends DiscordModules.React.Component {
        state = {hasError: false, error: null}

        static getDerivedStateFromError(error) {
            return {
                hasError: true,
                error: error.message
            };
        }

        componentDidCatch(error, errorInfo) {
            console.error(error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                return (
                    <ErrorState>{this.state.error}</ErrorState>
                );
            }

            return this.props.children;
        }
    }
}));

export default ErrorBoundary;