import { useEffect, useState } from "react";
import { Text, View, StyleSheet, DimensionValue } from "react-native";
import ProgressCard from "./progress-card";
import ProgressBar from "./progress-bar";

export default function InventoryProgress(
    {
        totalItems,
        countedItems,
    }
        :
        {
            totalItems: number,
            countedItems: number,

        }) {

    const [barPercentage, setBarPercentage] = useState<DimensionValue>()
    const [Percentage, setPercentage] = useState(0)

    const getPercentage = () => {

        let res = Math.floor((countedItems / totalItems) * 100)
        if (isNaN(res))
            res = 0

        setBarPercentage(`${res}%` as DimensionValue)
        setPercentage(res)
    }

    useEffect(() => {
        getPercentage()
    }, [totalItems, countedItems])
    return (
        <View style={styles.progress}>
            <View style={styles.progressCard}>
                <View style={styles.progressBarArea}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#FFF" }}>Progresso do Inventário</Text>
                        <Text style={{ color: "#FFF", fontWeight: "600" }}>{Percentage}%</Text>
                    </View>

                    <ProgressBar percentage={barPercentage} color={"#758BAB"}></ProgressBar>

                </View>
                <View style={styles.progressStatusArea}>
                    <ProgressCard label="Total Estocados" color={"#60A5FA"} number={totalItems}></ProgressCard>
                    <ProgressCard label="Itens Apurados" color={"#8FCB74"} number={countedItems}></ProgressCard>
                    <ProgressCard label="Itens Pendentes" color={"#FFC107"} number={totalItems - countedItems}></ProgressCard>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progress: {
        padding: 12,
        borderBottomColor: "#79859B",
        borderBottomWidth: 0.8
    },
    progressCard: {
        flexDirection: "column",
        padding: 12,
        borderRadius: 15,
        borderWidth: 1,
        gap: 16,
        borderColor: "#79859B"
    },
    progressBarArea: {
        gap: 16
    },
    progressStatusArea: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center",
        alignItems: "center"
    }
})