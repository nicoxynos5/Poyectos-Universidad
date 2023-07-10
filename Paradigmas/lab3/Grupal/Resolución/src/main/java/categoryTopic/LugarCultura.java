package categoryTopic;
import interfaceTopics.*;
import namedEntity.*;

public class LugarCultura extends Lugar implements Cultura{
	public LugarCultura(String name, String category, String topic, int frequency) {
		super(name, category, topic, frequency);
	}
}
