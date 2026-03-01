import joblib
import numpy as np
from features import get_nws_alert_level, get_gauge_ratio


model = joblib.load('model.pkl') 

def score_city(city_name):
    al = get_nws_alert_level(city_name)
    gr = get_gauge_ratio(city_name)

    index_dict = {
    'Atlanta': 4,
    'Savannah': 9,
    'Augusta': 5,
    'Columbus': 6,
    'St. Simons': 10,
    'Macon': 7,
    'Albany': 2,
    'Athens': 3,
    'Roswell': 8
    }

    input_city = np.zeros(11) #same shape as X_train 
    input_city[index_dict[city_name]] = 1; 
    input_city[0] = al; 
    input_city[1] = gr; 
    proba = model.predict_proba(input_city.reshape(1, -1))[:, 1] #return probability of class 1 (aka prob of high risk) 
    return float(proba[0])
