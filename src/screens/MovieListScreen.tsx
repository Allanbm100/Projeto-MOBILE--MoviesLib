import { useNavigation } from "@react-navigation/native"
import { View, StyleSheet, Text, Button, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import MovieRow from "../components/MovieRow";

import movies from "../data/movies.json"

export default function MovieListScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.title}>Filmes</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("MovieFormScreen")}>
                        <Text style={{ color: "#EB4435", fontSize: 30, fontWeight: "black", marginRight: 10 }}>+</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.list}
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("MovieDetailsScreen", { movieId: item.id })}>
                            <MovieRow movie={item} />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
    },
    list: {
        marginVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
    },
})