import "./textarea.css"
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const top=7;

const left=1;
const width=50;
const fsize=20;

const t=100-top;
const side=(100-width)/2;


export default function View(){
    const [list, setList] = useState([1,2,3,4,5,6]);
    const [index, setIndex] =useState(0)
    function Next(){
        if (list.length-1>index){
            setIndex(index+1);
        }
    }
    function Prev(){
        if (index>0){
            setIndex(index-1);
        }
    }

    return (
        <div className={"overflow-y-hidden"}>
            <Navigate index={index} setindex={setIndex} next={Next} prev={Prev} list={list} ></Navigate>
            <Background></Background>
            <SelectedPage></SelectedPage>
        </div>
    );
}

function Navigate({list, prev, next, index, setindex}){
    const navigate=useNavigate();
    const back=()=>{
        navigate("/home");
    };
    return(


        <div className={`fixed z-40 top-0 left-0 w-screen flex justify-center items-center bg-blue-400`}
             style={{height: `${top}vh`}}>
            <button onClick={back} className={"absolute left-0 ml-5"}>&lt; &lt; Back home</button>
            <button className={"relative left-0"}>Collections</button>
            <button onClick={prev} disabled={index===0}>Previous</button>
            <select className={"w-[90px]"} name="select" value={list[index]} onChange={e=>setindex(list.indexOf(Number(e.currentTarget.value)))}>
                {list.map(function (n) {
                    return (<option value={n}>{n}</option>);
                })}
            </select>
            <button onClick={next} disabled={index===list.length-1}>Next</button>
            <button>Settings</button>
            <button className={"absolute mr-[26vw] right-0"}>Save</button>
            <button className={"absolute right-0 mr-5"}>Username</button>
        </div>
    )
}

function Background() {
    let background = "../../src/assets/background-1.avif";
    return (
        <div style={{backgroundImage: `url(${background})`, backgroundSize:"auto", backgroundRepeat:"repeat"}}
        className={"absolute w-full h-full top-0 left-0 z-0"}></div>
    )
}

function SelectedPage(){
    return(
        <>
            <div className={`absolute w-screen z-30 top-0 left-0 flex justify-center `}
            style={{height:`${t}vh` }}>

                <textarea className={`h-full w-screen overflow-y-auto resize-none `}
                          style={{backgroundColor: 'rgba(255,255,255,0)', marginTop: `${top}vh`, marginLeft: `${left}vh`,
                          paddingLeft: `${side}vw`, paddingRight: `${side}vw`, fontSize:`${fsize}px`}}>

                </textarea>

            </div>
            <div className={` absolute top-0 z-10 bg-white flex justify-center`}
            style={{height:`${t}vh`, marginTop: `${top}vh`, width: `${width}vw`, left: `${side}vw`}}>

            </div>

        </>

    )
}
