import {type FallbackProps} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

export default function ErrorFallbackComponent(arg:FallbackProps) {
    return (
        <Alert variant="danger">
            <strong>Oops, something went wrong.</strong>
            <p>{JSON.stringify(arg.error)}</p>
        </Alert>
    )
}
