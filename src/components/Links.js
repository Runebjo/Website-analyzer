import React from 'react'

export const Links = ({links}) => {
    let numOfAmazonLinks = 0;
    if (links && links.length > 0) {
        console.log("links", links);
        numOfAmazonLinks = links.reduce((acc, a) => {
            return acc + a.linkData.length;
        }, 0);
    }
    
    return (
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
                    <td className='px-4 py-2 border'>{numOfAmazonLinks}</td>
                </tr>
            </tbody>
        </table>
    )
}