import { useTranslation } from "react-i18next";

import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Pressable } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { SwipeListView } from "react-native-swipe-list-view";
import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMovie, getMovies } from "../services/movieService";
import MovieRow, { Movie } from "../components/MovieRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_COLORS } from "../colors/Colors";
import { AppContext } from "../../App";
import React from "react";
// import movies from "../data/movies.json"

export default function MovieListScreen() {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState("");
    const { value } = React.useContext(AppContext);
    const { t } = useTranslation()

    const { data: movies, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['movies'],
        queryFn: getMovies,
        select: (data) => data.sort((a: Movie, b: Movie) => {
            if (category != "" && category != null) {
                const aHasCategory = a.categories.includes(category)
                const bHasCategory = b.categories.includes(category)
                if (aHasCategory && !bHasCategory) return -1
                if (!aHasCategory && bHasCategory) return 1
            }
            return a.title.localeCompare(b.title)
        }), 
    });

    const loadData = async () => {
        try {
            const storedCategory = await AsyncStorage.getItem("category")
            setCategory(storedCategory ?? "")
        } catch (error) {
            console.log("Erro ao carregar os ajustes: ", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        }, [queryClient])
    )

    const renderHiddenItem = (data: any) => {
        <View style={styles.rowBack}>
            <TouchableOpacity style={styles.backRightBtn}
                onPress={() => {
                    Alert.alert(t("deleteConfirm"), t("sureDeleteConfirm"),
                        [
                            { text: t("cancel"), style: 'cancel' },
                            { text: t("delete"), style: 'destructive', onPress: () => deleteRow(data.item.id) },
                        ],
                        { cancelable: true }
                    )
                }}
            >
                <Text style={styles.backTextWhite}>{t("delete")}</Text>
            </TouchableOpacity>
        </View>
    }

    const deleteRow = async (movieID) => {
        try {
            await deleteMovie(movieID)
            queryClient.invalidateQueries({ queryKey: ["movies"] });

        } catch (error) {
            Alert.alert(t("erro"), t("notPossibleDelete"))
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={ APP_COLORS[Number(value)] } />
            </View>
        )
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text>{t("errorLoadMovie")}</Text>
            </View>
        )
    }
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.title}>{t("movies")}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("MovieFormScreen")}>
                        <Text style={{ color: APP_COLORS[Number(value)], fontSize: 32, fontWeight: "black", marginRight: 10 }}>+</Text>
                    </TouchableOpacity>
                </View>
                <SwipeListView
                    style={styles.list}
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => navigation.navigate('MovieDetailsScreen', { movie: item })}
                        >
                            <MovieRow movie={item} />
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}

                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={refetch}
                            colors={["#cecece"]}
                            tintColor="#cecece"
                        />
                    }

                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe={true}
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
        backgroundColor: '#eee'
    },
    list: {
        marginVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold'
    },
   center: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    rowBack: {
        alignItems: 'flex-end',
        backgroundColor: '#FF4136',
        justifyContent: 'flex-end',
        borderRadius: 8,
    },
    backRightBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: '100%',
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight: 'bold',
    },
})