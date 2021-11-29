import DiscordModules, {promise} from "../../modules/discord";
import {fromPromise} from "./asynccomponent";

const ErrorBoundary = fromPromise(promise.then(() => {
    return class ErrorBoundary extends DiscordModules.React.Component {
        state = {hasError: false}

        static getDerivedStateFromError(error) {
            return {hasError: true};
        }

        componentDidCatch(error, errorInfo) {
            console.error(error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                return (
                    <p style={{color: "#ed4245"}}>Component Error</p>
                );
            }

            return this.props.children;
        }
    }
}));

export default ErrorBoundary;