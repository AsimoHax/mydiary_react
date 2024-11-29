import {useNavigate, useParams} from "react-router-dom"
export default function Token() {
    const navigate= useNavigate();
    const t = useParams()
    navigate("s");
    return (
        <h1>22</h1>
    );
}