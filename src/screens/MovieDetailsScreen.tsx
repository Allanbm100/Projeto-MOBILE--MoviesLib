import { View, StyleSheet, Text, Image, ScrollView } from "react-native"
import PlayButton from "../components/PlayButton"
import AntDesign from "@expo/vector-icons/AntDesign"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useRoute } from "@react-navigation/native" 
import { LinearGradient } from "expo-linear-gradient"
import type { Movie } from "../components/MovieRow"

export default function MovieDetailsScreen() {

    const route = useRoute();
    const { movie } = route.params as { movie: Movie }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <Image source={{ uri: movie.poster }} style={{ width: "100%", height: 320 }} />
                    <LinearGradient 
                        colors={["transparent", "white"]} 
                        style={styles.gradient} 
                        start={{ x:0, y:0.5 }} 
                        end={{ x:0, y:1 }}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={{ fontSize: 32, fontWeight: "bold", marginVertical: 12 }}>
                        { movie.title }
                    </Text>

                    <View style={{ flexDirection: "row", marginBottom: 12 }}>
                        <AntDesign name="star" size={20} color="#F7CB46" />
                        <Text style={[styles.text, { marginBottom: 12 }]}>{ movie.rating }/10</Text>
                    </View>

                    <Text style={[styles.text, { marginBottom: 12 }]}>{ movie.categories }</Text>

                    <PlayButton />

                    <ScrollView style={styles.synopsisContainer} contentContainerStyle={styles.synopsisContent}>
                        <Text style={[styles.text, { marginBottom: 12, fontSize: 18, fontWeight: "600" }]}>
                            Sinopse
                        </Text>
                        <Text style={[styles.text, { marginBottom: 24 }]}>
                            { movie.synopsis }
                        </Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        flex: 1,
    },
    text: {
        fontSize: 17,
    },
    synopsisContainer: {
        flex: 1,
        backgroundColor: "#E8E8E8",
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 12,
    },
    synopsisContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})