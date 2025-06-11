import { StyleSheet, Text, View } from "react-native";

export default function HowToUse() {

    const data = [
        { id: 1, title: "Selecione o arquivo CSV com os dados atuais do estoque" },
        { id: 2, title: "Confirme se os dados foram lidos corretamente" },
        { id: 3, title: "Confirme se os dados foram lidos corretamente" },
        { id: 4, title: "Ao final, exporte o arquivo CSV atualizado" }
    ]

    return (
        <View style={styles.howToUse}>
            <Text style={styles.howToUseTitle}>Como usar:</Text>

            {
                data.map((item, index) => {
                    return (
                        <View style={styles.listItem} key={index}>
                            <View style={styles.listItemsDecoration}>
                                <Text style={{ color: "white", fontWeight: "bold" }}>{item.id}</Text>
                            </View>
                            <Text style={styles.howToUseText}>
                                {item.title}
                            </Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    howToUse: {
        borderColor: "#475569",
        borderWidth: 1,
        borderRadius: 15,
        borderStyle: "solid",
        gap: 15,
        padding: 20,
        boxSizing: "border-box"
    },
    howToUseTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#A2ACBA"
    },
    listItem: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    howToUseText: {
        color: "#94A3B8",
    },
    listItemsDecoration: {
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
    }
})