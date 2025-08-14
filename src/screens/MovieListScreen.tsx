import { useNavigation } from "@react-navigation/native"
import { View, StyleSheet, Text, Button } from "react-native"

export default function MovieListScreen() {

    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text>MovieListScreen</Text>
        <Button title="Ir para detalhes" onPress={() => navigation.navigate("MovieDetailsScreen")} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
})