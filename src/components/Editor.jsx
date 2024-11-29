import React, {useEffect, useRef, useState} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css';

export default function Editor({fontSize,setFontSize,entries, eid, val, setVal, saving, setCount}) {
    const quillRef = useRef(null);
    var Size= Quill.import('formats/size');
    Size.whitelist=['12px','13px','14px','16px','18px','20px','22px','24px','32px'];
    Quill.register(Size, true);
    useEffect(() => {
        const entry = entries.find((e) => e.eid === parseInt(eid));
        if (entry && entry.content) {
            quillRef.current.getEditor().setContents(JSON.parse(entry.content));

            setVal(JSON.parse(entry.content));
        }

    }, [eid, entries]);
    function handleType(){
        setVal(quillRef.current.getEditor().getContents());
        setCount(quillRef.current.getEditor().getText().trim().split(/\s+/).length);
    }
    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': Size.whitelist }],
            [{ 'header': '1' }, { 'header': '2' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    return(<>
        <ReactQuill
            ref={quillRef}
            readOnly={saving}
            className={"fixed bg-white h-[88vh] w-1/2 overflow-y-hidden mt-[7vh] z-40 left-1/2 transform -translate-x-1/2"}
            theme="snow"
            value={val}
            onChange={handleType}
            style={{fontSize: '30px'}}
            modules={modules}

        />
        </>
    );
}