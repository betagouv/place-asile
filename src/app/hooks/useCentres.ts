import { useEffect, useState } from "react"

export const useCentres = () => {
    const [centres, setCentres] = useState([]);
    useEffect(() => {
        const getCentres = async () => {
            const result = await fetch("/api/centres")
            const centres = await result.json()
            setCentres(centres);
        }
        getCentres()
    }, [])

    return centres
}