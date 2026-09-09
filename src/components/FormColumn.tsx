import {type ReactNode} from "react";
import {Col, Row} from "react-bootstrap";
import classNames from "classnames";

export interface FormColumnProps {
    label: string|ReactNode;
    width?: number;
    className?: string;
    children?: ReactNode;
}

export default function FormColumn({ label, width, className, children }: FormColumnProps) {
    return (
        <div className={classNames(className, 'container', 'mb-1')}>
            <Row className="g-3">
                <Col xs={12 - (width ?? 8)}>
                    {label}
                </Col>
                <Col>
                    {children}
                </Col>
            </Row>
        </div>
    );
}
