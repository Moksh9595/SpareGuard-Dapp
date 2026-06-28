const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNTYzOGQzMC0xZjY1LTQ5ZmQtYjUxNC1iNDQ0MzU4OGE4ZGEiLCJlbWFpbCI6InZlZG1hbGt1bmFpa0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGY4MmYyYWEwZDQxODJiZDM5NTEiLCJzY29wZWRLZXlTZWNyZXQiOiJkOGY4NzVkZmU3MWYwY2M1ZTYzNWFjMGQ0MzU2NjI0NTM3ZDBlMDVjZmJhN2JjOTcwYjRlZmQwZmZlN2QwZDBiIiwiZXhwIjoxODE0MTE1NzQyfQ.TWLCz5XLY3LkfTQRILXaBJGP11oGQga3ziYx_TsY4-0'

export const uploadFileToPinata = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const pinataMetadata = JSON.stringify({
    name: file.name,
  })
  formData.append('pinataMetadata', pinataMetadata)

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', pinataOptions)

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    // Return a standard IPFS gateway URL
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw error
  }
}
