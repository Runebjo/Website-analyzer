import React, { useState, useEffect } from 'react'
import { Modal } from './Modal';

export const Links = ({ links }) => {
    const [displayModal, setDisplayModal] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const [tags, setTags] = useState([]);
    const [numOfAmazonLinks, setNumOfAmazonLinks] = useState(0);

    useEffect(() => {
        resetFilterList();
        
        if (links && links.length > 0) {
            let numOfAmazonLinks = links.reduce((acc, a) => {
                return acc + a.linkData.length;
            }, 0);

            setNumOfAmazonLinks(numOfAmazonLinks);

            const tagNames = links.map(link => link.tags).reduce((a, b) => a.concat(b), []);
            const uniqueTagNames = [...new Set(tagNames)];

            getNumLinksFromTags(uniqueTagNames);
        }
    }, [links])

    function resetFilterList() {
        setFilteredList(JSON.parse(JSON.stringify(links)));
        const newTag = tags.map(t => {
           return {...t, selected: false};
        });
        setTags(newTag);
    }

    function getNumLinksFromTags(uniqueTagNames) {
        const newTags = uniqueTagNames.map((tag, index) => {
            let numOfLinks = links.map(link => {
                return link.linkData.filter(ld => ld.link.indexOf(`${tag}`) > 0).length;
            }).reduce((a,b) => a+b);
            return {tag, numOfLinks, index, selected: false};
        });

        setTags(newTags);
    }

    function closeModal() {
        setDisplayModal(false);
    }

    function filterList(tag = {}) {
        let tempLinks = JSON.parse(JSON.stringify(links));
        let filt = tempLinks.map(link => {
            if (tag) link.linkData = link.linkData.filter(ld => ld.link.indexOf(`${tag.tag}`) > 0);
            return link;
        }).filter(link => link.linkData.length > 0);

        const newTags = tags.map(t => {
            let selected = t.tag === tag.tag ? true : false;
            return { ...t, selected };
        })

        setFilteredList(filt);
        setTags(newTags);
    }

    return (
        <>
            <table className='mt-4 table-auto w-full'>
                <thead>
                    <tr>
                        <th colSpan='2' className={`px-4 py-2 bg-gray-300 text-left`}>
                            Links
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='px-4 py-2 border'>Inbound Links</td>
                        <td className='px-4 py-2 border'></td>
                    </tr>
                    <tr className='bg-gray-200'>
                        <td className='px-4 py-2 border'>Outbound Links</td>
                        <td className='px-4 py-2 border'></td>
                    </tr>
                    <tr>
                        <td className='px-4 py-2 border'>Amazon Links</td>
                        <td className='px-4 py-2 border text-blue-600 cursor-pointer visited:text-blue-800 hover:text-blue-300 focus:outline-none' onClick={() => setDisplayModal(true)}>{numOfAmazonLinks}</td>
                    </tr>
                </tbody>
            </table>
            {displayModal && <Modal closeModal={closeModal} isHeight={true}>
                <div className="flex justify-between">
                    <div className='m-4'>
                        {tags.map((tag) => {
                            return <p key={tag.index}
                                className='text-blue-600 cursor-pointer visited:text-blue-800 hover:text-blue-300 focus:outline-none p-2 mb-2'
                                style={tag.selected ? { border: '1px solid black' } : null}
                                onClick={() => filterList(tag)}>{tag.tag} - {tag.numOfLinks}</p>
                        })}
                    </div>
                    <div className="m-4">
                        <button className='px-4 py-1 ml-1 border rounded-lg focus:outline-none focus:shadow-outline'
                            onClick={() => resetFilterList()}>
                            Reset
                        </button>
                    </div>
                </div>
                {filteredList.map((link, index) => {
                    return (
                        <div key={index}>
                            <div className='m-4'>
                                <h1 className='text-sm font-bold'>{link.postTitle}</h1>
                            </div>
                            <div className='m-4'>
                                <ul>
                                    {link.linkData.map((o, index) => {
                                        return <li key={index} className='text-xs overflow-hidden whitespace-no-wrap'>{o.link}</li>;
                                    })}
                                </ul>

                            </div>
                        </div>)
                })}
            </Modal>}
        </>
    )
}