import { useState, useEffect } from "react"

import Map from "./Map"

const apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${
  import.meta.env.VITE_API_KEY
}`

async function getDataAboutQuery(query = "") {
  if (query.startsWith("www.")) {
    const res = await fetch(`${apiUrl}&domain=${query}`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data
  } else if (query === "") {
    const res = await fetch(apiUrl)
    const data = await res.json()
    return data
  } else {
    const res = await fetch(`${apiUrl}&ipAddress=${query}`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data
  }
}

export default function App() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const position = [data?.location?.lat, data?.location?.lng]

  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      try {
        setErrMsg("")
        setError(false)
        setIsLoading(true)
        const data = await getDataAboutQuery(query)
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setError(true)
        setErrMsg("Failed to fetch data. Please try again later.")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      setErrMsg("")
      setError(false)
      setIsLoading(true)
      if (!query) return
      const data = await getDataAboutQuery(query)
      setData(data)
      setIsLoading(false)
    } catch (error) {
      setError(true)
      setErrMsg("Failed to fetch data. Please try again later.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="basis-[19rem] bg-mobile lg:bg-desktop bg-cover flex flex-col items-center p-2.4">
        <div className="flex justify-center w-full max-w-[1200px] relative">
          <div className="w-full absolute top-[200px] bg-[#fff] grid grid-cols-1 gap-2.4 lg:grid-cols-4 justify-center rounded-lg p-3.2 shadow-md z-40">
            {isLoading ? (
              <p className="lg:col-span-4 text-2.4 lg:text-3 text-center text-dark-gray font-medium">
                Loading...
              </p>
            ) : (
              <>
                {error ? (
                  <p className="lg:col-span-4 text-2.4 lg:text-3 text-center text-dark-gray font-medium">
                    {errMsg}
                  </p>
                ) : (
                  <>
                    <div className="flex flex-col gap-0.4 items-center lg:items-start lg:border-r-[1px] lg:border-dark-gray lg:pr-1.6">
                      <p className="uppercase text-dark-gray text-1.2 lg:text-1.4 font-medium tracking-wider">
                        IP Address
                      </p>
                      <p className="font-medium text-2 lg:text-3">{data?.ip}</p>
                    </div>
                    <div className="flex flex-col gap-0.4 items-center lg:items-start lg:border-r-[1px] lg:border-dark-gray lg:pr-1.6">
                      <p className="uppercase text-dark-gray text-1.2 lg:text-1.4 font-medium tracking-wider">
                        Location
                      </p>
                      <p className="font-medium text-2 lg:text-3">
                        {data?.location?.city}, {data?.location?.country}{" "}
                        {data?.postalCode}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.4 items-center lg:items-start lg:border-r-[1px] lg:border-dark-gray lg:pr-1.6">
                      <p className="uppercase text-dark-gray text-1.2 lg:text-1.4 font-medium tracking-wider">
                        Timezone
                      </p>
                      <p className="font-medium text-2 lg:text-3">
                        UTC {data?.location?.timezone}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.4 items-center lg:items-start ">
                      <p className="uppercase text-dark-gray text-1.2 lg:text-1.4 font-medium tracking-wider lg:pr-1.6">
                        ISP
                      </p>
                      <p className="font-medium text-2 lg:text-3">
                        {data?.isp}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2.4 w-full">
            <h1 className="text-[#fff] text-2.4 font-medium text-center">
              IP Address Tracker
            </h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="flex justify-center">
                <input
                  className="py-1.6 px-1.6 text-very-dark-gray placeholder:text-dark-gray rounded-bl-xl rounded-tl-xl w-full lg:w-[50%] focus:ring-4 focus:ring-dark-gray outline-none"
                  type="text"
                  placeholder="Search for any IP address or domain (e.g. www.example.com)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="bg-very-dark-gray py-1.6 px-2.4 rounded-tr-xl rounded-br-xl focus:ring-4 focus:ring-dark-gray outline-none hover:bg-very-dark-gray/70 transition-colors duration-300">
                  <img src="icon-arrow.svg" alt="arrow icon" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {Object.values(data).length && <Map position={position} />}
    </>
  )
}
