import mlflow
import mlflow.sklearn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

iris = load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

mlflow.set_experiment("Iris_Classification")

with mlflow.start_run():

    n_estimators = 50
    max_depth = 3

    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)
    mlflow.log_metric("accuracy", accuracy)

    mlflow.sklearn.log_model(
        model,
        "random_forest_model",
        skops_trusted_types=["sklearn.tree._tree.Tree"]
    )

    mlflow.sklearn.save_model(
        model,
        "model",
        skops_trusted_types=["sklearn.tree._tree.Tree"]
    )

    print("Model Accuracy:", accuracy)
