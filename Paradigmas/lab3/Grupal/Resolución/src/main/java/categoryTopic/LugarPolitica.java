package categoryTopic;
import interfaceTopics.*;
import namedEntity.*;

public class LugarPolitica extends Lugar implements Politica{
	public LugarPolitica(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}
