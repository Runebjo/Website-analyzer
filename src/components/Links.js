import React, { useState, useEffect } from 'react'
import { Modal } from './Modal';

export const Links = ({ links }) => {
    const [displayModal, setDisplayModal] = useState(false);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        console.log("links", links);
        setFilteredList(links);
    }, [links])

    let numOfAmazonLinks = 0;
    let tags = [];
    if (links && links.length > 0) {
        
        numOfAmazonLinks = links.reduce((acc, a) => {
            return acc + a.linkData.length;
        }, 0);

        tags = links.map(link => link.tags).reduce((a, b) => a.concat(b), []);
        tags = [...new Set(tags)];
    }

    function closeModal() {
        setDisplayModal(false);
    }

    function filterList(tag) {
        let filt = links.map(link => {
            link.linkData = link.linkData.filter(ld => ld.link.indexOf(`${tag}`) > 0);
            console.log("amz", link.linkData);
            return link;
        }).filter(link => link.linkData.length > 0);
        console.log(`filt`, filt);
        setFilteredList(filt);
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
                        <td className='px-4 py-2 border' onClick={() => setDisplayModal(true)}>{numOfAmazonLinks}</td>
                    </tr>
                </tbody>
            </table>
            {displayModal && <Modal closeModal={closeModal}>
                <div className='m-4'>
                    {tags.map(tag => {
                        return <p onClick={() => filterList(tag)}>{tag}</p>
                    })}
                </div>
                {filteredList.map((link, index) => {
                    return (
                        <div key={index}>
                            <div className='m-4'>
                                <h1 className='text-sm font-bold'>{link.postTitle}</h1>
                            </div>
                            <div className='m-4'>
                                <ul>
                                    {link.linkData.map(o => {
                                        return <li className='text-xs overflow-hidden whitespace-no-wrap'>{o.link}</li>;
                                    })}
                                </ul>
                            </div>
                        </div>)
                })}
            </Modal>}
        </>
    )
}