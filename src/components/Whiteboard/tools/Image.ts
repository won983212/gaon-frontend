// TODO Implement
import { ITool } from '@/components/Whiteboard/tools/ITool';

export default function Image(): ITool {
    return {
        getToolType: () => 'image'
    };
}
