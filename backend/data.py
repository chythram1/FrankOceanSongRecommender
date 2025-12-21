"""
Frank Ocean Song Library
Each song has a valence score (0.0 = sad/dark, 1.0 = happy/bright)
Valence scores are manually assigned based on musical and lyrical analysis, as spotify no longer allows you to pull valence data from their api :(
"""

FRANK_LIBRARY = [
    # Real Spotify valence where available, otherwise estimated
    {"title": "Nikes", "id": "19YKaevk2bce4odJkP5L22", "album": "Blonde", "valence": 0.32,  
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Ivy", "id": "2ZWlPOoWh0626oTaHrnl2a", "album": "Blonde", "valence": 0.47,  # REAL Spotify data
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Pink + White", "id": "3xKsf9qdS1CyvXSMEid6g8", "album": "Blonde", "valence": 0.99, 
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Solo", "id": "35xSkNIXi504fcEwz9USRB", "album": "Blonde", "valence": 0.35,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Skyline To", "id": "4xR3MAscflQ262kMeiKshQ", "album": "Blonde", "valence": 0.40,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Self Control", "id": "5GUYJTQap5F3RDQiCOJhrS", "album": "Blonde", "valence": 0.45,  # REAL Spotify data, suprising bc i would consider it a lot more sad
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Nights", "id": "7eqoqGkKwgOaWNNHx90uEZ", "album": "Blonde", "valence": 0.43,  # REAL Spotify data
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Solo (Reprise)", "id": "2qtoRFCOEL1gRn5q9DJC7F", "album": "Blonde", "valence": 0.30,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Pretty Sweet", "id": "17yrCsl1Ai6CZLBmGj6d6p", "album": "Blonde", "valence": 0.38,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "White Ferrari", "id": "2LMkwUfqC6S6s6qDVlEuzV", "album": "Blonde", "valence": 0.26,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Seigfried", "id": "1BViPjTT585XAhkUUrkts0", "album": "Blonde", "valence": 0.21,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Godspeed", "id": "34xTFwjPQ1dC6uJmleno7x", "album": "Blonde", "valence": 0.32,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},
    {"title": "Futura Free", "id": "5k8LB57xOq8UUNVaKWSqrf", "album": "Blonde", "valence": 0.60,  # estimated
     "cover": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526"},

    # Channel Orange (2012) - CORRECT IDs from Spotify
    {"title": "Thinkin Bout You", "id": "7DfFc7a6Rwfi3YQMRbDMau", "album": "Channel Orange", "valence": 0.48,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Sweet Life", "id": "6MEDfjHxnVNcYmHe3mM6L2", "album": "Channel Orange", "valence": 0.72,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Super Rich Kids", "id": "0725YWm6Z0TpZ6wrNk64Eb", "album": "Channel Orange", "valence": 0.70,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Pilot Jones", "id": "2ohegz9maxzroKBu9YhcCM", "album": "Channel Orange", "valence": 0.38,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Crack Rock", "id": "5lcyIeEfwZTs8Ajw3kdF7P", "album": "Channel Orange", "valence": 0.20,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Pyramids", "id": "4QhWbupniDd44EDtnh2bFJ", "album": "Channel Orange", "valence": 0.58,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Lost", "id": "3GZD6HmiNUhxXYf8Gch723", "album": "Channel Orange", "valence": 0.68,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Monks", "id": "0msrDPXxZpts4FRnoX0bFr", "album": "Channel Orange", "valence": 0.45,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Bad Religion", "id": "2pMPWE7PJH1PizfgGRMnR9", "album": "Channel Orange", "valence": 0.18,  # estimated low - very sad song
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Pink Matter", "id": "1fOkmYW3ZFkkjIdOZSf596", "album": "Channel Orange", "valence": 0.42,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},
    {"title": "Forrest Gump", "id": "4YZbVct8l9MnAVIROnLQdx", "album": "Channel Orange", "valence": 0.75,
     "cover": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5"},

    # Nostalgia, Ultra (2011)
    {"title": "Novacane", "id": "2qm3EQFmuLbz8IkXN8mI4p", "album": "Nostalgia, Ultra", "valence": 0.62,
     "cover": "https://i.scdn.co/image/ab67616d0000b27359a428dc7ef8e0c12b0fe18a"},
    {"title": "Swim Good", "id": "6A5M6tKEYqNIoB4fOkwHMV", "album": "Nostalgia, Ultra", "valence": 0.70,
     "cover": "https://i.scdn.co/image/ab67616d0000b273ebbff7725d3ce0739be01787"},

    # Singles
    {"title": "Chanel", "id": "6Nv3ATD0EVKA0GoTZFscB4", "album": "Single", "valence": 0.47,  
     "cover": "https://i.scdn.co/image/ab67616d0000b273a0b780c23fc3c19bd412b234"},
    {"title": "Moon River", "id": "3CTWvaV1LYdVEW8hXvnxRl", "album": "Single", "valence": 0.25,
     "cover": "https://i.scdn.co/image/ab67616d0000b2736566b46cd24c5f2d0561ee7a"},
    {"title": "In My Room", "id": "3WCXVzgj4JFTK1OIJULG5g", "album": "Single", "valence": 0.30,
     "cover": "https://i.scdn.co/image/ab67616d0000b273db974f9533dd9b362891b5db"},
    {"title": "Cayendo", "id": "0sf8Ac6mZ2B1HJIcJiqvbE", "album": "Single", "valence": 0.22,
     "cover": "https://i.scdn.co/image/ab67616d0000b27335d8be841e9f7f777fbca446"},
    {"title": "Dear April", "id": "4oPdbFcBhJVyNsgJaAJnip", "album": "Single", "valence": 0.10,
     "cover": "https://i.scdn.co/image/ab67616d0000b27367136d7919a1dc6a51ce3daf"},
    {"title": "Biking", "id": "5S4cCeafLRGrx8TqCVMZkR", "album": "Single", "valence": 0.48,
     "cover": "https://i.scdn.co/image/ab67616d0000b27369a8328489e5e485514a8667"},
]

